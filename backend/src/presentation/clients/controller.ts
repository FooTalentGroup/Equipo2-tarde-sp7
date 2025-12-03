import type { Request, Response } from "express";

import { CreateClientDto, CustomError, UpdateClientDto } from "../../domain";
import type { ClientServices } from "../services/client.services";

export class ClientController {
	constructor(private readonly clientServices: ClientServices) {}

	private handleError = (error: unknown, res: Response) => {
		if (error instanceof CustomError) {
			return res.status(error.statusCode).json({
				message: error.message,
			});
		}

		// Manejar errores de PostgreSQL
		if (error && typeof error === "object" && "code" in error) {
			const pgError = error as any;

			// Error 23505: Violación de restricción única
			if (pgError.code === "23505") {
				const constraint = pgError.constraint || "";
				const detail = pgError.detail || "";

				// Detectar qué campo está duplicado
				if (constraint.includes("email")) {
					const emailMatch = detail.match(/\(email\)=\(([^)]+)\)/);
					const email = emailMatch ? emailMatch[1] : "el email proporcionado";
					return res.status(409).json({
						message: `El email ${email} ya está registrado. Por favor, use otro email.`,
					});
				}

				if (constraint.includes("dni")) {
					const dniMatch = detail.match(/\(dni\)=\(([^)]+)\)/);
					const dni = dniMatch ? dniMatch[1] : "el DNI proporcionado";
					return res.status(409).json({
						message: `El DNI ${dni} ya está registrado. Por favor, use otro DNI.`,
					});
				}

				if (constraint.includes("phone")) {
					return res.status(409).json({
						message:
							"El teléfono ya está registrado. Por favor, use otro teléfono.",
					});
				}

				// Error genérico de restricción única
				return res.status(409).json({
					message:
						"Ya existe un registro con estos datos. Por favor, verifique la información.",
				});
			}

			// Error 23503: Violación de clave foránea
			if (pgError.code === "23503") {
				return res.status(400).json({
					message:
						"Los datos proporcionados no son válidos. Verifique las referencias a otros registros.",
				});
			}

			// Error 23502: Violación de NOT NULL
			if (pgError.code === "23502") {
				const column = pgError.column || "campo";
				return res.status(400).json({
					message: `El campo ${column} es requerido y no puede estar vacío.`,
				});
			}
		}

		console.error("Client Controller Error:", error);
		return res.status(500).json({
			message: "Internal server error",
		});
	};

	/**
	 * Crea un nuevo cliente
	 */
	createClient = async (req: Request, res: Response) => {
		try {
			const [error, createClientDto] = CreateClientDto.create(req.body);

			if (error || !createClientDto) {
				return res.status(400).json({
					message: error || "Invalid client data",
				});
			}

			const result = await this.clientServices.createClient(createClientDto);
			return res.status(201).json({
				message: "Client created successfully",
				data: result,
			});
		} catch (error) {
			this.handleError(error, res);
		}
	};

	/**
	 * Lista clientes con filtros opcionales
	 */
	listClients = async (req: Request, res: Response) => {
		try {
			const {
				contact_category_id,
				purchase_interest,
				rental_interest,
				city_id,
				search,
				includeDeleted,
				limit,
				offset,
			} = req.query;

			const filters: any = {};

			if (contact_category_id)
				filters.contact_category_id = Number(contact_category_id);
			if (purchase_interest !== undefined)
				filters.purchase_interest = purchase_interest === "true";
			if (rental_interest !== undefined)
				filters.rental_interest = rental_interest === "true";
			if (city_id) filters.city_id = Number(city_id);
			if (search) filters.search = String(search);
			if (limit) filters.limit = Number(limit);
			if (offset) filters.offset = Number(offset);
			if (includeDeleted === "true") filters.includeDeleted = true;

			const result = await this.clientServices.listClients(filters);
			return res.json(result);
		} catch (error) {
			this.handleError(error, res);
		}
	};

	/**
	 * Obtiene un cliente por ID
	 */
	getClientById = async (req: Request, res: Response) => {
		try {
			const { id } = req.params;

			if (!id || isNaN(Number(id))) {
				return res.status(400).json({
					message: "Invalid client ID",
				});
			}

			const result = await this.clientServices.getClientById(Number(id));
			return res.json(result);
		} catch (error) {
			this.handleError(error, res);
		}
	};

	/**
	 * Actualiza un cliente
	 */
	updateClient = async (req: Request, res: Response) => {
		try {
			const { id } = req.params;

			if (!id || isNaN(Number(id))) {
				return res.status(400).json({
					message: "Invalid client ID",
				});
			}

			const [error, updateClientDto] = UpdateClientDto.create(req.body);

			if (error || !updateClientDto) {
				return res.status(400).json({
					message: error || "Invalid client data",
				});
			}

			const result = await this.clientServices.updateClient(
				Number(id),
				updateClientDto,
			);
			return res.json({
				message: "Client updated successfully",
				data: result,
			});
		} catch (error) {
			this.handleError(error, res);
		}
	};

	/**
	 * Soft delete: marca el cliente como eliminado
	 */
	deleteClient = async (req: Request, res: Response) => {
		try {
			const { id } = req.params;

			if (!id || isNaN(Number(id))) {
				return res.status(400).json({
					message: "Invalid client ID",
				});
			}

			const result = await this.clientServices.deleteClient(Number(id));
			return res.json(result);
		} catch (error) {
			this.handleError(error, res);
		}
	};

	/**
	 * Restaura un cliente eliminado
	 */
	restoreClient = async (req: Request, res: Response) => {
		try {
			const { id } = req.params;

			if (!id || isNaN(Number(id))) {
				return res.status(400).json({
					message: "Invalid client ID",
				});
			}

			const result = await this.clientServices.restoreClient(Number(id));
			return res.json(result);
		} catch (error) {
			this.handleError(error, res);
		}
	};
}
