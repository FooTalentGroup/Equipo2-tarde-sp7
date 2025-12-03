import { z } from "zod";

// Schema para el formulario de contacto inicial
// Este schema solo contiene los campos que se solicitan en el primer formulario
// Los campos adicionales del Lead se agregarán en formularios posteriores
export const contactFormSchema = z.object({
	first_name: z
		.string()
		.min(2, "El nombre debe tener al menos 2 caracteres")
		.max(50, "El nombre no puede exceder 50 caracteres")
		.regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El nombre solo puede contener letras"),

	last_name: z
		.string()
		.min(2, "El apellido debe tener al menos 2 caracteres")
		.max(50, "El apellido no puede exceder 50 caracteres")
		.regex(
			/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
			"El apellido solo puede contener letras",
		),

	phone: z
		.string()
		.min(10, "El teléfono debe tener al menos 10 dígitos")
		.max(15, "El teléfono no puede exceder 15 dígitos")
		.regex(/^[0-9]+$/, "El teléfono solo puede contener números"),

	email: z
		.string()
		.email("Email inválido")
		.min(5, "El email debe tener al menos 5 caracteres")
		.max(100, "El email no puede exceder 100 caracteres")
		.toLowerCase(),

	consultation_type: z.enum(
		["rental", "sale", "purchase"] as const,
		"Seleccione un tipo de consulta",
	),

	interest_zone: z
		.string()
		.min(2, "La zona de interés debe tener al menos 2 caracteres")
		.max(200, "La zona de interés no puede exceder 200 caracteres"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// Tipo auxiliar para el tipo de consulta
export type ConsultationType = "rental" | "sale" | "purchase";
