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

            // Buscar clientes por teléfono
            const clientsByPhone = await ClientModel.findByPhone(dto.phone);
            
            // Verificar si alguno coincide exactamente con nombre, apellido y teléfono
            if (clientsByPhone && clientsByPhone.length > 0) {
                client = clientsByPhone.find(c => 
                    c.first_name === dto.first_name && 
                    c.last_name === dto.last_name &&
                    c.phone === dto.phone
                ) || null;
            }

            // Si no existe un cliente con los 3 campos coincidentes, crear nuevo cliente con categoría "Lead"
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

    /**
     * Obtener todas las consultas con información completa
     * - Incluye datos del cliente, propiedad y tipo de consulta
     * - Soporta paginación y filtros
     */
    async getAllConsultations(filters?: {
        limit?: number;
        offset?: number;
        consultation_type_id?: number;
        start_date?: string;
        end_date?: string;
    }) {
        try {
            const dbClient = PostgresDatabase.getClient();
            
            // Construir query con JOINs para obtener información completa
            let query = `
                SELECT 
                    cc.id,
                    cc.consultation_date,
                    cc.message,
                    cc.response,
                    cc.response_date,
                    -- Cliente
                    c.id as client_id,
                    c.first_name as client_first_name,
                    c.last_name as client_last_name,
                    c.email as client_email,
                    c.phone as client_phone,
                    -- Propiedad
                    p.id as property_id,
                    p.title as property_title,
                    -- Tipo de consulta
                    ct.id as consultation_type_id,
                    ct.name as consultation_type_name
                FROM client_consultations cc
                INNER JOIN clients c ON cc.client_id = c.id
                LEFT JOIN properties p ON cc.property_id = p.id
                INNER JOIN consultation_types ct ON cc.consultation_type_id = ct.id
            `;

            const conditions: string[] = [];
            const values: any[] = [];
            let paramIndex = 1;

            // Aplicar filtros
            if (filters) {
                if (filters.consultation_type_id) {
                    conditions.push(`cc.consultation_type_id = $${paramIndex++}`);
                    values.push(filters.consultation_type_id);
                }
                if (filters.start_date) {
                    conditions.push(`cc.consultation_date >= $${paramIndex++}`);
                    values.push(filters.start_date);
                }
                if (filters.end_date) {
                    conditions.push(`cc.consultation_date <= $${paramIndex++}`);
                    values.push(filters.end_date);
                }
            }

            if (conditions.length > 0) {
                query += ` WHERE ${conditions.join(' AND ')}`;
            }

            query += ` ORDER BY cc.consultation_date DESC`;

            // Paginación
            const limit = filters?.limit || 50;
            const offset = filters?.offset || 0;
            
            query += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
            values.push(limit, offset);

            const result = await dbClient.query(query, values);

            // Formatear respuesta
            const consultations = result.rows.map(row => ({
                id: row.id,
                consultation_date: row.consultation_date,
                message: row.message,
                response: row.response,
                response_date: row.response_date,
                client: {
                    id: row.client_id,
                    first_name: row.client_first_name,
                    last_name: row.client_last_name,
                    email: row.client_email,
                    phone: row.client_phone,
                },
                property: row.property_id ? {
                    id: row.property_id,
                    title: row.property_title,
                } : null,
                consultation_type: {
                    id: row.consultation_type_id,
                    name: row.consultation_type_name,
                },
            }));

            // Obtener total de registros para paginación
            const countQuery = `
                SELECT COUNT(*) as total
                FROM client_consultations cc
                ${conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''}
            `;
            const countResult = await dbClient.query(countQuery, values.slice(0, values.length - 2));
            const total = parseInt(countResult.rows[0].total);

            return {
                consultations,
                pagination: {
                    total,
                    limit,
                    offset,
                    hasMore: offset + consultations.length < total,
                },
            };
        } catch (error) {
            console.error('Error getting consultations:', error);
            throw CustomError.internalServerError('Error retrieving consultations');
        }
    }
}
