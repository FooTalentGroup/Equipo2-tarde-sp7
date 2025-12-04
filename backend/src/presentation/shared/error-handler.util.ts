import type { Response } from "express";

import { CustomError } from "../../domain";

/**
 * Utilidad para manejar errores de forma consistente en todos los controladores
 * Extrae la lógica común de manejo de errores de PostgreSQL y CustomError
 */
export class ErrorHandlerUtil {
	/**
	 * Maneja errores y retorna respuesta HTTP apropiada
	 * @param error - Error a manejar
	 * @param res - Objeto Response de Express
	 * @param controllerName - Nombre del controlador para logging (opcional)
	 */
	static handleError(
		error: unknown,
		res: Response,
		controllerName?: string,
	): void {
		if (error instanceof CustomError) {
			res.status(error.statusCode).json({
				message: error.message,
			});
			return;
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
					res.status(409).json({
						message: `El email ${email} ya está registrado. Por favor, use otro email.`,
					});
					return;
				}

				if (constraint.includes("dni")) {
					const dniMatch = detail.match(/\(dni\)=\(([^)]+)\)/);
					const dni = dniMatch ? dniMatch[1] : "el DNI proporcionado";
					res.status(409).json({
						message: `El DNI ${dni} ya está registrado. Por favor, use otro DNI.`,
					});
					return;
				}

				if (constraint.includes("phone")) {
					res.status(409).json({
						message:
							"El teléfono ya está registrado. Por favor, use otro teléfono.",
					});
					return;
				}

				// Error genérico de restricción única
				res.status(409).json({
					message:
						"Ya existe un registro con estos datos. Por favor, verifique la información.",
				});
				return;
			}

			// Error 23503: Violación de clave foránea
			if (pgError.code === "23503") {
				res.status(400).json({
					message:
						"Los datos proporcionados no son válidos. Verifique las referencias a otros registros.",
				});
				return;
			}

			// Error 23502: Violación de NOT NULL
			if (pgError.code === "23502") {
				const column = pgError.column || "campo";
				res.status(400).json({
					message: `El campo ${column} es requerido y no puede estar vacío.`,
				});
				return;
			}

			// Error 22001: Valor demasiado largo para el tipo de dato
			if (pgError.code === "22001") {
				// Intentar identificar el campo problemático del mensaje de error
				const errorMessage = pgError.message || "";
				let fieldName = "campo";

				if (errorMessage.includes("phone")) {
					fieldName = "teléfono";
				} else if (errorMessage.includes("dni")) {
					fieldName = "DNI";
				} else if (errorMessage.includes("email")) {
					fieldName = "email";
				}

				res.status(400).json({
					message: `El valor del campo ${fieldName} es demasiado largo. Por favor, verifique que no exceda el límite permitido.`,
				});
				return;
			}
		}

		// Error genérico
		const controllerLabel = controllerName ? `${controllerName} ` : "";
		console.error(`${controllerLabel}Controller Error:`, error);
		res.status(500).json({
			message: "Internal server error",
		});
	}
}
