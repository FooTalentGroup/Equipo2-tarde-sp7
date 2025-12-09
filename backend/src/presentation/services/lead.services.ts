import { TransactionHelper } from '../../data/postgres/transaction.helper';
import { 
    ClientConsultationModel,
    ConsultationTypeModel
} from '../../data/postgres/models';
import { CreateLeadDto } from '../../domain/dtos/clients/create-lead.dto';
import { CustomError, ClientEntity } from '../../domain';
import { ClientCreationHelper } from './helpers/client-creation.helper';

/**
 * Service para manejar operaciones específicas de Leads
 * Incluye creación de cliente Lead y consulta asociada
 */
export class LeadServices {
    
    /**
     * Crea un Lead con consulta y propiedad de interés si se proporciona
     * Todo en una transacción: si falla cualquier paso, se revierte todo
     */
    async createLeadWithConsultation(
        createLeadDto: CreateLeadDto,
        assignedUserId?: number
    ) {
        return await TransactionHelper.executeInTransaction(async () => {
            // 1. Resolver contact_category_id para "Lead" usando helper
            const categoryId = await ClientCreationHelper.resolveContactCategory('Lead');

            // 2. Validar que la propiedad existe si se proporciona property_id
            if (createLeadDto.property_id) {
                await ClientCreationHelper.validatePropertyExists(createLeadDto.property_id);
            }

            // 3. Resolver consultation_type_id si se proporciona nombre
            let consultationTypeId: number | undefined = undefined;
            if (createLeadDto.consultation_type_id) {
                consultationTypeId = createLeadDto.consultation_type_id;
            } else if (createLeadDto.consultation_type) {
                const consultationType = await ConsultationTypeModel.findByName(createLeadDto.consultation_type);
                if (!consultationType || !consultationType.id) {
                    throw CustomError.badRequest(
                        `Consultation type "${createLeadDto.consultation_type}" not found`
                    );
                }
                consultationTypeId = consultationType.id;
            }

            // 3. Crear el cliente (Lead) usando helper
            const { client: newClient, wasCreated } = await ClientCreationHelper.createBaseClient({
                first_name: createLeadDto.first_name,
                last_name: createLeadDto.last_name,
                phone: createLeadDto.phone,
                email: createLeadDto.email,
                notes: createLeadDto.notes,
            }, categoryId);

            // 4. Si hay consultation_type_id, crear la consulta
            let consultation = null;
            if (consultationTypeId && newClient.id) {
                consultation = await ClientConsultationModel.create({
                    client_id: newClient.id,
                    property_id: createLeadDto.property_id,
                    consultation_type_id: consultationTypeId,
                    assigned_user_id: assignedUserId,
                    message: createLeadDto.notes || 'Consulta de interés',
                    consultation_date: new Date(),
                });
            }

            // 5. Crear entity del cliente para retornar
            const clientEntity = ClientEntity.fromDatabaseObject(newClient);

            return {
                client: clientEntity.toPublicObject(),
                was_existing_client: !wasCreated,
                consultation: consultation ? {
                    id: consultation.id,
                    consultation_type_id: consultation.consultation_type_id,
                    property_id: consultation.property_id,
                    message: consultation.message,
                } : null,
            };
        });
    }
}

