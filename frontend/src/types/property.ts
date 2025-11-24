import { z } from "zod";

export const PropertyStatus = {
	AVAILABLE: "available",
	UNAVAILABLE: "unavailable",
} as const;

export const propertyStatusEnum = z.enum(["available", "unavailable"]);
export type PropertyStatusType = z.infer<typeof propertyStatusEnum>;

export const PropertyType = {
	APARTMENT: "apartment",
	HOUSE: "house",
	PH: "ph",
} as const;

export const propertyFormSchema = z.object({
	id: z.string().optional(),
	title: z.string().min(3, "El título es obligatorio"),
	slug: z.string().optional(),
	propertyType: z.string().min(1, "El tipo de propiedad es obligatorio"),
	status: propertyStatusEnum,
	address: z.string().min(3, "La dirección es obligatoria"),
	city: z.string().min(2, "La ciudad es obligatoria"),
	province: z.string().min(2, "La provincia es obligatoria"),
	postalCode: z.string().min(1, "El código postal es obligatorio"),
	assignedOwner: z.string().min(1, "El propietario asignado es obligatorio"),
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
	price: z
		.transform(Number)
		.pipe(z.number().positive("El precio es requerido")),
	expenses: z
		.transform(Number)
		.pipe(z.number().min(0, "Debe ser mayor o igual a 0")),
	currency: z.string().min(1, "La moneda es obligatoria"),
	thumbnail: z.string().optional(),
});

export type PropertyData = z.infer<typeof propertyFormSchema>;
