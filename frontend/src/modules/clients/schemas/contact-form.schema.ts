import { isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";

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
		.min(1, "El teléfono es requerido")
		.refine(isValidPhoneNumber, {
			message: "Número de teléfono inválido",
		}),

	email: z
		.string()
		.email("Email inválido")
		.min(5, "El email debe tener al menos 5 caracteres")
		.max(100, "El email no puede exceder 100 caracteres")
		.toLowerCase(),

	consultation_type_id: z.number().int().positive(),
	interest_zone: z
		.string()
		.max(200, "La zona de interés no puede exceder 200 caracteres")
		.optional()
		.or(z.literal("")),
	property_id: z.string().optional(),
	notes: z
		.string()
		.max(300, "Las notas no pueden exceder 300 caracteres")
		.optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export type ConsultationType = "rental" | "sale" | "purchase";
