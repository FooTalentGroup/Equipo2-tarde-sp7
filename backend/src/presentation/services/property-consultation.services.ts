import { CustomError } from '../../domain';
import { CreatePropertyConsultationDto } from '../../domain/dtos/consultations/create-property-consultation.dto';
import { PropertyModel } from '../../data/postgres/models/properties/property.model';
import { ClientModel } from '../../data/postgres/models/clients/client.model';
import { ClientConsultationModel } from '../../data/postgres/models/crm/client-consultation.model';
import { ContactCategoryModel } from '../../data/postgres/models/clients/contact-category.model';
import { ConsultationTypeModel } from '../../data/postgres/models/crm/consultation-type.model';
import { PostgresDatabase } from '../../data/postgres/database';

export class PropertyConsultationServices {
    constructor() {}

    /**
     * Crea una consulta de propiedad desde la web pública
     * - Valida que la propiedad existe y está publicada
     * - Busca o crea el cliente como Lead
     * - Crea la consulta vinculada
     */
    async createPropertyConsultation(dto: CreatePropertyConsultationDto) {
        try {
            // 1. Validar que la propiedad existe y está publicada
            const property = await PropertyModel.findById(dto.property_id);
            
            if (!property) {
                throw CustomError.notFound('Property not found or not available');
            }

            // 2. Buscar o crear cliente
            let client = null;

            // Buscar por teléfono primero
            const clientsByPhone = await ClientModel.findByPhone(dto.phone);
            if (clientsByPhone && clientsByPhone.length > 0) {
                client = clientsByPhone[0];
            }

            // Si no se encontró por teléfono y tiene email, buscar por email
            if (!client && dto.email) {
                client = await ClientModel.findByEmail(dto.email);
            }

            // Si no existe, crear nuevo cliente con categoría "Lead"
            if (!client) {
                // Obtener ID de categoría "Lead"
                const leadCategory = await ContactCategoryModel.findByName('Lead');
                
                if (!leadCategory || !leadCategory.id) {
                    throw CustomError.internalServerError(
                        'Lead category not configured. Please run database seeds.'
                    );
                }

                // Crear nuevo cliente
                client = await ClientModel.create({
                    first_name: dto.first_name,
                    last_name: dto.last_name,
                    phone: dto.phone,
                    email: dto.email,
                    contact_category_id: leadCategory.id,
                    purchase_interest: true, // Asumimos interés de compra por defecto
                    rental_interest: false,
                });
            }

            // 3. Determinar tipo de consulta basado en la operación de la propiedad
            let consultationTypeName = 'Consulta de Propiedad'; // Default genérico
            
            // Obtener los precios/operaciones de la propiedad
            const dbClient = PostgresDatabase.getClient();
            const pricesQuery = `
                SELECT pot.name as operation_type_name
                FROM property_prices pp
                JOIN property_operation_types pot ON pp.operation_type_id = pot.id
                WHERE pp.property_id = $1
                ORDER BY pp.updated_at DESC
            `;
            const pricesResult = await dbClient.query(pricesQuery, [dto.property_id]);
            
            if (pricesResult.rows.length > 0) {
                // Si solo tiene un tipo de operación, usar ese específico
                if (pricesResult.rows.length === 1) {
                    const operationType = pricesResult.rows[0].operation_type_name;
                    
                    if (operationType === 'Venta') {
                        consultationTypeName = 'Consulta de Venta';
                    } else if (operationType === 'Alquiler' || operationType === 'Alquiler Temporal') {
                        consultationTypeName = 'Consulta de Alquiler';
                    }
                }
                // Si tiene múltiples operaciones (ej: Venta y Alquiler), usar genérico
            }
            
            const consultationType = await ConsultationTypeModel.findByName(consultationTypeName);
            
            if (!consultationType || !consultationType.id) {
                throw CustomError.internalServerError(
                    `Consultation type "${consultationTypeName}" not configured. Please run database seeds.`
                );
            }

            // 4. Crear la consulta
            const consultation = await ClientConsultationModel.create({
                client_id: client.id!,
                property_id: dto.property_id,
                consultation_type_id: consultationType.id,
                message: dto.message,
                consultation_date: new Date(),
            });

            // 5. Retornar respuesta
            return {
                message: 'Consultation submitted successfully',
                consultation: {
                    id: consultation.id,
                    client_id: consultation.client_id,
                    property_id: consultation.property_id,
                    message: consultation.message,
                    consultation_date: consultation.consultation_date,
                },
                property: {
                    id: property.id,
                    title: property.title,
                },
                client: {
                    id: client.id,
                    first_name: client.first_name,
                    last_name: client.last_name,
                    email: client.email,
                },
            };
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            console.error('Error creating property consultation:', error);
            throw CustomError.internalServerError('Error creating consultation');
        }
    }
}
