import { TransactionHelper } from '../../data/postgres/transaction.helper';
import { 
    PropertyModel
} from '../../data/postgres/models';
import { CreateOwnerDto } from '../../domain/dtos/clients/create-owner.dto';
import { CustomError, ClientEntity } from '../../domain';
import { ClientCreationHelper } from './helpers/client-creation.helper';

/**
 * Service para manejar operaciones específicas de propietarios
 * Incluye creación de cliente propietario y asociación con propiedad
 */
export class OwnerServices {
    
    /**
     * Crea un propietario y lo asocia a una propiedad si se proporciona
     * Todo en una transacción: si falla cualquier paso, se revierte todo
     */
    async createOwnerWithProperty(
        createOwnerDto: CreateOwnerDto
    ) {
        return await TransactionHelper.executeInTransaction(async () => {
            // 1. Resolver contact_category_id para "Propietario" usando helper
            const categoryId = await ClientCreationHelper.resolveContactCategory('Propietario');

            // 2. Validar que la propiedad existe si se proporciona property_id
            let property = null;
            let propertyAssociated = false;
            if (createOwnerDto.property_id) {
                property = await ClientCreationHelper.validatePropertyExists(createOwnerDto.property_id);
                
                // Verificar si la propiedad ya tiene un propietario
                if (property.owner_id) {
                    // No asociar el propietario si la propiedad ya tiene uno
                    // El propietario se crea pero no se asocia a la propiedad
                    propertyAssociated = false;
                } else {
                    // La propiedad no tiene propietario, se puede asociar
                    propertyAssociated = true;
                }
            }

            // 3. Crear el cliente (propietario) usando helper
            const { client: newClient, wasCreated } = await ClientCreationHelper.createBaseClient({
                first_name: createOwnerDto.first_name,
                last_name: createOwnerDto.last_name,
                phone: createOwnerDto.phone,
                email: createOwnerDto.email,
                dni: createOwnerDto.dni,
                address: createOwnerDto.address,
                notes: createOwnerDto.notes,
            }, categoryId);

            // 4. Si hay property_id y la propiedad no tiene propietario, asociar el propietario
            if (createOwnerDto.property_id && property && propertyAssociated && newClient.id) {
                // Actualizar la propiedad con el owner_id
                const updatedProperty = await PropertyModel.update(createOwnerDto.property_id, {
                    owner_id: newClient.id
                });

                if (!updatedProperty) {
                    throw CustomError.internalServerError('Failed to associate owner with property');
                }
            }

            // 5. Crear entity del cliente para retornar
            const clientEntity = ClientEntity.fromDatabaseObject(newClient);

            return {
                client: clientEntity.toPublicObject(),
                was_existing_client: !wasCreated,
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

