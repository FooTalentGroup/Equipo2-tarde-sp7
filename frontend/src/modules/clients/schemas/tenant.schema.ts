import { z } from "zod";

export const inquilinoSchema = z.object({
	nombreApellido: z
		.string()
		.min(1, "El nombre y apellido es requerido")
		.min(3, "El nombre debe tener al menos 3 caracteres"),

	dni: z.string().optional().or(z.literal("")),

	telefono: z
		.string()
		.min(1, "El teléfono es requerido")
		.regex(/^\+?[0-9\s-]+$/, "Formato de teléfono inválido"),

	email: z
		.string()
		.email("Formato de email inválido")
		.optional()
		.or(z.literal("")),

	propiedadQueSeMuda: z.string().optional().or(z.literal("")),

	fechaInicioContrato: z
		.string()
		.min(1, "La fecha de inicio es requerida")
		.regex(/^\d{2}\/\d{2}\/\d{4}$/, "Formato de fecha inválido (dd/mm/yyyy)"),

	fechaFinContrato: z
		.string()
		.min(1, "La fecha de fin es requerida")
		.regex(/^\d{2}\/\d{2}\/\d{4}$/, "Formato de fecha inválido (dd/mm/yyyy)"),

	fechaProximoAumento: z.string().optional().or(z.literal("")),

	montoAlquiler: z
		.string()
		.min(1, "El monto de alquiler es requerido")
		.regex(/^\d+(\.\d{1,2})?$/, "Formato de monto inválido"),

	recordarAumento: z.boolean(),

	recordarFinContrato: z.boolean(),

	documentacion: z.instanceof(File).optional().or(z.literal(undefined)),
});

export type InquilinoFormData = z.infer<typeof inquilinoSchema>;
