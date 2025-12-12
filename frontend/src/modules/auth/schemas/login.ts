import { z } from "zod";

export const loginSchema = z.object({
	email: z.email({ pattern: z.regexes.email, message: "Email no válido" }),
	password: z
		.string()
		.min(1, "La contraseña es requerida")
		.min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
