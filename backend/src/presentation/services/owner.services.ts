import { TransactionHelper } from '../../data/postgres/transaction.helper';
import { 
    PropertyModel
} from '../../data/postgres/models';
import { CreateOwnerDto } from '../../domain/dtos/clients/create-owner.dto';
import { CustomError, ClientEntity } from '../../domain';
import { ClientCreationHelper } from './helpers/client-creation.helper';


export class OwnerServices {
    
 
    async createOwnerWithProperty(
        createOwnerDto: CreateOwnerDto
    ) {
        return await TransactionHelper.executeInTransaction(async () => {
            const categoryId = await ClientCreationHelper.resolveContactCategory('Propietario');

            let property = null;
            let propertyAssociated = false;
            if (createOwnerDto.property_id) {
                property = await ClientCreationHelper.validatePropertyExists(createOwnerDto.property_id);
                
                if (property.owner_id) {
                    propertyAssociated = false;
                } else {
                    propertyAssociated = true;
                }
            }
            const { client: newClient, wasCreated } = await ClientCreationHelper.createBaseClient({
                first_name: createOwnerDto.first_name,
                last_name: createOwnerDto.last_name,
                phone: createOwnerDto.phone,
                email: createOwnerDto.email,
                dni: createOwnerDto.dni,
                address: createOwnerDto.address,
                notes: createOwnerDto.notes,
            }, categoryId);

            if (createOwnerDto.property_id && property && propertyAssociated && newClient.id) {
                const updatedProperty = await PropertyModel.update(createOwnerDto.property_id, {
                    owner_id: newClient.id
                });

                if (!updatedProperty) {
                    throw CustomError.internalServerError('Failed to associate owner with property');
                }
            }

            const clientEntity = ClientEntity.fromDatabaseObject(newClient);

            return {
                client: clientEntity.toPublicObject(),
                property: property ? {
                    id: property.id,
                    title: property.title,
                    owner_id: propertyAssociated ? newClient.id : property.owner_id,
                    message: propertyAssociated 
                        ? 'Owner successfully associated with property'
                        : 'Property already has an owner. Owner created but not associated. Edit the property to change the owner.'
                } : null,
            };
        });
    }
}

