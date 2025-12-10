import { TransactionHelper } from '../../data/postgres/transaction.helper';
import { 
    ClientPropertyInterestModel
} from '../../data/postgres/models';
import { CreateLeadDto } from '../../domain/dtos/clients/create-lead.dto';
import { ClientEntity } from '../../domain';
import { ClientCreationHelper } from './helpers/client-creation.helper';

/**
 * Service para manejar operaciones específicas de Leads
 * Incluye creación de cliente Lead y propiedad de interés
 */
export class LeadServices {
    
    /**
     * Crea un Lead con propiedad de interés si se proporciona
     * La tabla client_consultation es solo para formularios de contacto de la página web
     * Todo en una transacción: si falla cualquier paso, se revierte todo
     */
    async createLeadWithConsultation(
        createLeadDto: CreateLeadDto
    ) {
        return await TransactionHelper.executeInTransaction(async () => {
            // 1. Resolver contact_category_id para "Lead" usando helper
            const categoryId = await ClientCreationHelper.resolveContactCategory('Lead');

            // 2. Validar que la propiedad existe si se proporciona property_id
            if (createLeadDto.property_id) {
                await ClientCreationHelper.validatePropertyExists(createLeadDto.property_id);
            }

            // 3. Crear el cliente (Lead) usando helper
            const { client: newClient } = await ClientCreationHelper.createBaseClient({
                first_name: createLeadDto.first_name,
                last_name: createLeadDto.last_name,
                phone: createLeadDto.phone,
                email: createLeadDto.email,
                notes: createLeadDto.notes,
            }, categoryId);

            // 4. Si hay property_id, guardar la propiedad de interés en client_property_interests
            let propertyInterest = null;
            if (createLeadDto.property_id && newClient.id) {
                try {
                    propertyInterest = await ClientPropertyInterestModel.create({
                        client_id: newClient.id,
                        property_id: createLeadDto.property_id,
                        notes: createLeadDto.notes || 'Propiedad de interés al crear Lead',
                    });
                } catch (error) {
                    // Si ya existe la relación, no es un error crítico
                    console.log(
                        `Property interest already exists for client ${newClient.id} and property ${createLeadDto.property_id}`
                    );
                }
            }

            // 5. Crear entity del cliente para retornar
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

