import { isValidPhoneNumber } from "react-phone-number-input";
import z from "zod";

export const generalContactSchema = z.object({
	first_name: z.string().min(2, {
		message: "Campo requerido",
	}),
	last_name: z.string().min(2, {
		message: "Campo requerido",
	}),
	email: z.string().email({
		message: "Ingrese un email válido.",
	}),
	phone: z
		.string()
		.min(1, "Campo requerido")
		.refine(isValidPhoneNumber, { message: "Número de teléfono inválido" }),
	message: z.string().min(10, {
		message: "El mensaje debe tener al menos 10 caracteres.",
	}),
});

export type GeneralContact = z.infer<typeof generalContactSchema>;
