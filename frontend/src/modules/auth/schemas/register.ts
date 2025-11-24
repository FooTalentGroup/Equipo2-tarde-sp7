import { z } from "zod";

export const registerSchema = z.object({
	email: z.email({ pattern: z.regexes.email, message: "Este campo es obligatorio" }),
	password: z
		.string()
		.min(1, "Este campo es obligatorio")
		.min(6, "La contraseña debe tener al menos 6 caracteres"),
	confirmPassword : z
		.string()
		.min(1, "Este campo es obligatorio")
		.min(6, "La contraseña debe tener al menos 6 caracteres"),
	firstName: z
		.string()
		.min(1, "Este campo es obligatorio")
		.min(2, "El nombre debe tener al menos 2 caracteres"),
	lastName: z
		.string()
		.min(1, "Este campo es obligatorio")
		.min(2, "El apellido debe tener al menos 2 caracteres"),
	role: z
		.string()
		.min(1, "Debes seleccionar un tipo de cuenta")
		.refine(
			(val) => val === "AGENT" || val === "ADMIN",
			"Selecciona si eres agente o propietario",
		),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
