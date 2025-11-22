import { z } from "zod";

// Helper para coerción de números
const numberField = z
	.union([z.number(), z.string()])
	.transform((val) => (typeof val === "string" ? Number(val) : val))
	.pipe(z.number().min(0, "Debe ser mayor o igual a 0"));

// Schema base de propiedad (sin ID) - usado para crear y actualizar
export const propertyFormSchema = z.object({
	id: z.string().optional(),
	// Información básica
	title: z.string().min(3, "El título es obligatorio"),
	propertyType: z.string().min(1, "El tipo de propiedad es obligatorio"),
	status: z.string().min(1, "El estado actual es obligatorio"),
	address: z.string().min(3, "La dirección es obligatoria"),
	city: z.string().min(2, "La ciudad es obligatoria"),
	province: z.string().min(2, "La provincia es obligatoria"),
	postalCode: z.string().min(1, "El código postal es obligatorio"),
	assignedOwner: z.string().min(1, "El propietario asignado es obligatorio"),

	// Características de la propiedad
	rooms: z
		.transform(Number)
		.pipe(z.number().positive("Este campo es requerido")),
	floors: z
		.transform(Number)
		.pipe(z.number().positive("Este campo es requerido")),
	bedrooms: z
		.transform(Number)
		.pipe(z.number().positive("Este campo es requerido")),
	age: z.transform(Number).pipe(z.number().positive("Este campo es requerido")),
	bathrooms: z
		.transform(Number)
		.pipe(z.number().positive("Este campo es requerido")),
	situation: z.string().optional(),
	toilets: z
		.transform(Number)
		.pipe(z.number().positive("Este campo es requerido")),
	orientation: z.string().optional(),
	garages: z
		.transform(Number)
		.pipe(z.number().positive("Este campo es requerido")),
	disposition: z.string().optional(),

	// Valores
	price: z
		.transform(Number)
		.pipe(z.number().positive("El precio es requerido")),
	expenses: z
		.transform(Number)
		.pipe(z.number().min(0, "Debe ser mayor o igual a 0")),
	currency: z.string().min(1, "La moneda es obligatoria"),
});

export type PropertyFormData = z.infer<typeof propertyFormSchema>;
