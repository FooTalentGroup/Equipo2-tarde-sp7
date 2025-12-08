import { z } from "zod";

export const clientSchema = z.object({
	name: z
		.string()
		.min(1, "El nombre es requerido")
		.min(2, "El nombre debe tener al menos 2 caracteres")
		.max(50, "El nombre no debe exceder los 50 caracteres"),
	email: z.email({
		pattern: z.regexes.email,
		message: "Correo electrónico inválido",
	}),
	number: z
		.number()
		.min(1000000000, "El numero debe tener al menos 10 digitos")
		.max(999999999999999, "El numero no debe exceder los 15 digitos"),
});

export type ClientFormData = z.infer<typeof clientSchema>;
