import { TransactionHelper } from '../../data/postgres/transaction.helper';
import { 
    ClientPropertyInterestModel
} from '../../data/postgres/models';
import { CreateLeadDto } from '../../domain/dtos/clients/create-lead.dto';
import { ClientEntity } from '../../domain';
import { ClientCreationHelper } from './helpers/client-creation.helper';


export class LeadServices {
    
  
    async createLeadWithConsultation(
        createLeadDto: CreateLeadDto
    ) {
        return await TransactionHelper.executeInTransaction(async () => {
            const categoryId = await ClientCreationHelper.resolveContactCategory('Lead');

            if (createLeadDto.property_id) {
                await ClientCreationHelper.validatePropertyExists(createLeadDto.property_id);
            }

            const { client: newClient } = await ClientCreationHelper.createBaseClient({
                first_name: createLeadDto.first_name,
                last_name: createLeadDto.last_name,
                phone: createLeadDto.phone,
                email: createLeadDto.email,
                notes: createLeadDto.notes,
            }, categoryId);

            let propertyInterest = null;
            if (createLeadDto.property_id && newClient.id) {
                try {
                    propertyInterest = await ClientPropertyInterestModel.create({
                        client_id: newClient.id,
                        property_id: createLeadDto.property_id,
                        notes: createLeadDto.notes || 'Propiedad de interés al crear Lead',
                    });
                } catch (error) {
                    console.log(
                        `Property interest already exists for client ${newClient.id} and property ${createLeadDto.property_id}`
                    );
                }
            }

            const clientEntity = ClientEntity.fromDatabaseObject(newClient);

            return {
                client: clientEntity.toPublicObject(),
                property_interest: propertyInterest ? {
                    id: propertyInterest.id,
                    property_id: propertyInterest.property_id,
                    notes: propertyInterest.notes,
                } : null,
            };
        });
    }
}

