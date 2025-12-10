import { z } from "zod";

export const tenantFormSchema = z
	.object({
		first_name: z.string().min(1, "El nombre es requerido"),
		last_name: z.string().min(1, "El apellido es requerido"),
		dni: z.string().min(7, "El DNI debe tener al menos 7 caracteres"),
		phone: z.string().min(10, "El teléfono debe tener al menos 10 caracteres"),
		email: z.string().email("Email inválido"),
		property_id: z.string().optional(),
		contract_start_date: z.string().min(1, "La fecha de inicio es requerida"),
		contract_end_date: z.string().min(1, "La fecha de fin es requerida"),
		next_increase_date: z.string().optional(),
		monthly_amount: z.string().min(1, "El monto de alquiler es requerido"),
		notes: z
			.string()
			.max(300, "Las notas no pueden exceder 300 caracteres")
			.optional(),
	})
	.refine(
		(data) => {
			if (data.contract_start_date && data.contract_end_date) {
				return (
					new Date(data.contract_start_date) < new Date(data.contract_end_date)
				);
			}
			return true;
		},
		{
			message: "La fecha de fin debe ser posterior a la fecha de inicio",
			path: ["contract_end_date"],
		},
	);

export type TenantFormData = z.infer<typeof tenantFormSchema>;
