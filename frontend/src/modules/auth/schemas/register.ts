import { z } from "zod";

export const registerSchema = z.object({
	email: z.email({
		pattern: z.regexes.email,
		message: "Este campo es obligatorio",
	}),
	password: z
		.string()
		.min(1, "Este campo es obligatorio")
		.min(6, "La contraseña debe tener al menos 6 caracteres"),
	confirmPassword: z
		.string()
		.min(1, "Este campo es obligatorio")
		.min(6, "La contraseña debe tener al menos 6 caracteres"),
	first_name: z
		.string()
		.min(1, "Este campo es obligatorio")
		.min(2, "El nombre debe tener al menos 2 caracteres"),
	last_name: z
		.string()
		.min(1, "Este campo es obligatorio")
		.min(2, "El apellido debe tener al menos 2 caracteres"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
