import { PostgresDatabase } from "../../data/postgres/database";
import { ClientModel } from "../../data/postgres/models/clients/client.model";
import { ClientConsultationModel } from "../../data/postgres/models/crm/client-consultation.model";
import { ConsultationTypeModel } from "../../data/postgres/models/crm/consultation-type.model";
import { PropertyModel } from "../../data/postgres/models/properties/property.model";
import { CustomError } from "../../domain";
import type { CreatePropertyConsultationDto } from "../../domain/dtos/consultations/create-property-consultation.dto";
import { ClientCreationHelper } from "./helpers/client-creation.helper";

export class PropertyConsultationServices {
	constructor() {}

	/**
	 * Crea una consulta de propiedad desde la web pública
	 * - Valida que la propiedad existe y está publicada
	 * - Almacena datos del consultante SIN crear el cliente
	 * - El cliente (Lead) se creará cuando el admin apruebe la consulta
	 */
	async createPropertyConsultation(dto: CreatePropertyConsultationDto) {
		try {
			// 1. Validar que la propiedad existe y está publicada
			const property = await PropertyModel.findById(dto.property_id);

			if (!property) {
				throw CustomError.notFound("Property not found or not available");
			}

			// 2. Determinar tipo de consulta basado en la operación de la propiedad
			let consultationTypeName = "Consulta de Propiedad"; // Default genérico

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

					if (operationType === "Venta") {
						consultationTypeName = "Consulta de Compra";
					} else if (
						operationType === "Alquiler" ||
						operationType === "Alquiler Temporal"
					) {
						consultationTypeName = "Consulta de Alquiler";
					}
				}
				// Si tiene múltiples operaciones (ej: Venta y Alquiler), usar genérico
			}

			const consultationType =
				await ConsultationTypeModel.findByName(consultationTypeName);

			if (!consultationType || !consultationType.id) {
				throw CustomError.internalServerError(
					`Consultation type "${consultationTypeName}" not configured. Please run database seeds.`,
				);
			}

			// 3. Crear la consulta SIN crear el cliente
			// Almacenar datos del consultante directamente en la consulta
			const consultation = await ClientConsultationModel.create({
				client_id: undefined, // No hay cliente todavía
				property_id: dto.property_id,
				consultation_type_id: consultationType.id,
				message: dto.message,
				consultation_date: new Date(),
				is_read: false,
				// Almacenar datos del consultante
				consultant_first_name: dto.first_name,
				consultant_last_name: dto.last_name,
				consultant_phone: dto.phone,
				consultant_email: dto.email,
			});

			// 4. Retornar respuesta
			return {
				message: "Consultation submitted successfully",
				consultation: {
					id: consultation.id,
					property_id: consultation.property_id,
					message: consultation.message,
					consultation_date: consultation.consultation_date,
				},
				property: {
					id: property.id,
					title: property.title,
				},
				consultant: {
					first_name: dto.first_name,
					last_name: dto.last_name,
					email: dto.email,
				},
			};
		} catch (error) {
			if (error instanceof CustomError) {
				throw error;
			}
			console.error("Error creating property consultation:", error);
			throw CustomError.internalServerError("Error creating consultation");
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
		is_read?: boolean;
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
                    cc.is_read,
                    -- Cliente (puede ser NULL si no se ha convertido)
                    c.id as client_id,
                    c.first_name as client_first_name,
                    c.last_name as client_last_name,
                    c.email as client_email,
                    c.phone as client_phone,
                    -- Datos del consultante (para consultas sin cliente)
                    cc.consultant_first_name,
                    cc.consultant_last_name,
                    cc.consultant_email,
                    cc.consultant_phone,
                    -- Propiedad
                    p.id as property_id,
                    p.title as property_title,
                    -- Tipo de consulta
                    ct.id as consultation_type_id,
                    ct.name as consultation_type_name
                FROM client_consultations cc
                LEFT JOIN clients c ON cc.client_id = c.id
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
				if (filters.is_read !== undefined) {
					conditions.push(`cc.is_read = $${paramIndex++}`);
					values.push(filters.is_read);
				}
			}

			if (conditions.length > 0) {
				query += ` WHERE ${conditions.join(" AND ")}`;
			}

			query += ` ORDER BY cc.consultation_date DESC`;

			// Paginación
			const limit = filters?.limit || 50;
			const offset = filters?.offset || 0;

			query += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
			values.push(limit, offset);

			const result = await dbClient.query(query, values);

			// Formatear respuesta
			const consultations = result.rows.map((row: any) => ({
				id: row.id,
				consultation_date: row.consultation_date,
				message: row.message,
				response: row.response,
				response_date: row.response_date,
				is_read: row.is_read,
				// Si tiene client_id, mostrar datos del cliente
				// Si no, mostrar datos del consultante
				client: row.client_id
					? {
							id: row.client_id,
							first_name: row.client_first_name,
							last_name: row.client_last_name,
							email: row.client_email,
							phone: row.client_phone,
						}
					: null,
				consultant: !row.client_id
					? {
							first_name: row.consultant_first_name,
							last_name: row.consultant_last_name,
							email: row.consultant_email,
							phone: row.consultant_phone,
						}
					: null,
				property: row.property_id
					? {
							id: row.property_id,
							title: row.property_title,
						}
					: null,
				consultation_type: {
					id: row.consultation_type_id,
					name: row.consultation_type_name,
				},
			}));

			// Obtener total de registros para paginación
			const countQuery = `
                SELECT COUNT(*) as total
                FROM client_consultations cc
                ${conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : ""}
            `;
			const countResult = await dbClient.query(
				countQuery,
				values.slice(0, values.length - 2),
			);
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
			console.error("Error getting consultations:", error);
			throw CustomError.internalServerError("Error retrieving consultations");
		}
	}

	/**
	 * Eliminar una consulta individual
	 * - Verifica que la consulta existe
	 * - Elimina de la base de datos
	 */
	async deleteConsultation(id: number) {
		try {
			// Verificar que la consulta existe
			const consultation = await ClientConsultationModel.findById(id);

			if (!consultation) {
				throw CustomError.notFound("Consultation not found");
			}

			// Eliminar la consulta
			const deleted = await ClientConsultationModel.delete(id);

			if (!deleted) {
				throw CustomError.internalServerError("Failed to delete consultation");
			}

			return {
				message: "Consultation deleted successfully",
			};
		} catch (error) {
			if (error instanceof CustomError) {
				throw error;
			}
			console.error("Error deleting consultation:", error);
			throw CustomError.internalServerError("Error deleting consultation");
		}
	}

	/**
	 * Eliminar múltiples consultas
	 * - Elimina todas las consultas con los IDs proporcionados
	 * - Retorna el número de consultas eliminadas
	 */
	async deleteMultipleConsultations(ids: number[]) {
		try {
			const deletedCount = await ClientConsultationModel.deleteMultiple(ids);

			return {
				message: `${deletedCount} consultation(s) deleted successfully`,
				deleted_count: deletedCount,
			};
		} catch (error) {
			console.error("Error deleting multiple consultations:", error);
			throw CustomError.internalServerError("Error deleting consultations");
		}
	}

	/**
	 * Marcar una consulta como leída
	 * - Verifica que la consulta existe
	 * - Actualiza el campo is_read a true
	 */
	async markAsRead(id: number) {
		try {
			// Verificar que la consulta existe
			const consultation = await ClientConsultationModel.findById(id);

			if (!consultation) {
				throw CustomError.notFound("Consultation not found");
			}

			// Marcar como leída
			const updated = await ClientConsultationModel.update(id, {
				is_read: true,
			});

			if (!updated) {
				throw CustomError.internalServerError(
					"Failed to mark consultation as read",
				);
			}

			return {
				message: "Consultation marked as read",
				consultation: updated,
			};
		} catch (error) {
			if (error instanceof CustomError) {
				throw error;
			}
			console.error("Error marking consultation as read:", error);
			throw CustomError.internalServerError("Error updating consultation");
		}
	}

	/**
	 * Convierte una consulta en un lead
	 * - Verifica que la consulta existe y no tiene cliente asociado
	 * - Busca cliente existente por email (previene duplicados)
	 * - Crea nuevo lead si no existe usando ClientCreationHelper
	 * - Asocia la consulta al cliente
	 */
	async convertConsultationToLead(
		consultationId: number,
		assignedUserId?: number,
	) {
		try {
			// 1. Obtener la consulta
			const consultation =
				await ClientConsultationModel.findById(consultationId);

			if (!consultation) {
				throw CustomError.notFound("Consultation not found");
			}

			// 2. Verificar que no tenga cliente asociado ya
			if (consultation.client_id) {
				throw CustomError.badRequest(
					"Consultation already has an associated client",
				);
			}

			// 3. Verificar que tenga datos del consultante
			if (
				!consultation.consultant_first_name ||
				!consultation.consultant_last_name ||
				!consultation.consultant_phone
			) {
				throw CustomError.badRequest(
					"Consultation is missing consultant information",
				);
			}

			let client = null;
			let wasNewLead = false;

			// 4. PRIORIDAD 1: Buscar por email si está disponible (previene duplicados)
			if (consultation.consultant_email) {
				client = await ClientModel.findByEmail(consultation.consultant_email);

				if (client) {
					console.log(
						`Using existing client with email: ${consultation.consultant_email}`,
					);
				}
			}

			// 5. PRIORIDAD 2: Si no se encontró por email, buscar por teléfono + nombre + apellido
			if (!client) {
				const clientsByPhone = await ClientModel.findByPhone(
					consultation.consultant_phone,
				);

				if (clientsByPhone && clientsByPhone.length > 0) {
					client =
						clientsByPhone.find(
							(c) =>
								c.first_name === consultation.consultant_first_name &&
								c.last_name === consultation.consultant_last_name &&
								c.phone === consultation.consultant_phone,
						) || null;
				}
			}

			// 6. PRIORIDAD 3: Si no existe, crear nuevo lead usando helper compartido
			if (!client) {
				// Resolver contact_category_id para "Lead"
				const categoryId =
					await ClientCreationHelper.resolveContactCategory("Lead");

				// Crear nuevo cliente usando helper (reutiliza validación de email único)
				client = await ClientCreationHelper.createBaseClient(
					{
						first_name: consultation.consultant_first_name,
						last_name: consultation.consultant_last_name,
						phone: consultation.consultant_phone,
						email: consultation.consultant_email,
						notes: `Converted from consultation #${consultationId}`,
					},
					categoryId,
				);

				wasNewLead = true;
				console.log(`Created new lead with ID: ${client.id}`);
			}

			// 7. Asociar la consulta al cliente
			const updatedConsultation = await ClientConsultationModel.update(
				consultationId,
				{
					client_id: client.id!,
					assigned_user_id: assignedUserId,
				},
			);

			return {
				message: "Consultation converted to lead successfully",
				consultation: updatedConsultation,
				client: {
					id: client.id,
					first_name: client.first_name,
					last_name: client.last_name,
					email: client.email,
					phone: client.phone,
				},
				was_new_lead: wasNewLead,
			};
		} catch (error) {
			if (error instanceof CustomError) {
				throw error;
			}
			console.error("Error converting consultation to lead:", error);
			throw CustomError.internalServerError(
				"Error converting consultation to lead",
			);
		}
	}
}
