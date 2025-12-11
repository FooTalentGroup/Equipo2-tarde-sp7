import { isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";

// Schema para el formulario de propietarios
export const ownerFormSchema = z.object({
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

	dni: z
		.string()
		.min(7, "El DNI debe tener al menos 7 dígitos")
		.max(8, "El DNI debe tener máximo 8 dígitos")
		.regex(/^[0-9]+$/, "El DNI solo puede contener números"),

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

	address: z
		.string()
		.min(5, "La dirección debe tener al menos 5 caracteres")
		.max(200, "La dirección no puede exceder 200 caracteres"),

	property_id: z.string().min(1, "Debe seleccionar una propiedad"),

	notes: z
		.string()
		.max(300, "Las notas no pueden exceder 300 caracteres")
		.optional()
		.or(z.literal("")),
});

export type OwnerFormData = z.infer<typeof ownerFormSchema>;
