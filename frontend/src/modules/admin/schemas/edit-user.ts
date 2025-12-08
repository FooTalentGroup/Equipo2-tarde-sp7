import { z } from "zod";

export const editUserSchema = z
	.object({
		first_name: z
			.string()
			.min(1, "El nombre es requerido")
			.min(2, "El nombre debe tener al menos 2 caracteres"),
		last_name: z
			.string()
			.min(1, "Este apellido es obligatorio")
			.min(2, "El apellido debe tener al menos 2 caracteres"),
		email: z.email({
			pattern: z.regexes.email,
			message: "Este campo es obligatorio",
		}),
		phone: z
			.string()
			.min(1, "Este campo es obligatorio")
			.min(10, "El teléfono debe tener al menos 10 caracteres")
			.max(17, "El teléfono no puede tener más de 17 caracteres"),
		password: z
			.string()
			.min(6, "La contraseña debe tener al menos 6 caracteres")
			.optional()
			.or(z.literal("")),
		confirmPassword: z.string().optional().or(z.literal("")),
		role: z.enum(["admin", "agent"]),
		active: z.boolean(),
	})
	.refine(
		(data) => {
			// Si se ingresa password, entonces debe haber confirmPassword y deben coincidir
			if (data.password && data.password.trim() !== "") {
				return data.password === data.confirmPassword;
			}
			// Si no hay password, es válido (no se va a cambiar)
			return true;
		},
		{
			message: "Las contraseñas no coinciden",
			path: ["confirmPassword"],
		},
	);

export type EditUserFormData = z.infer<typeof editUserSchema>;
