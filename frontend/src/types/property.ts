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

export const commonValuesPropertySchema = z.object({
	id: z.string().optional(),
	slug: z.string().optional(),
	status: propertyStatusEnum.optional(),
});

export const basicInfoPropertySchema = z.object({
	title: z.string().min(3, "El título es obligatorio"),
	propertyType: z.string().min(1, "El tipo de propiedad es obligatorio"),
	address: z.string().min(3, "La dirección es obligatoria"),
	floor: z.string().optional(),
	city: z.string().min(2, "La ciudad es obligatoria"),
	province: z.string().min(2, "La provincia es obligatoria"),
	postalCode: z.string().min(1, "El código postal es obligatorio"),
	assignedOwner: z.string().min(1, "El propietario asignado es obligatorio"),
});

export const featuresPropertySchema = z.object({
	bedrooms: z
		.transform(Number)
		.pipe(z.number().positive("Este campo es requerido")),
	rooms: z
		.transform(Number)
		.pipe(z.number().positive("Este campo es requerido")),
	bathrooms: z
		.transform(Number)
		.pipe(z.number().positive("Este campo es requerido")),
	toilets: z
		.transform(Number)
		.pipe(z.number().positive("Este campo es requerido")),
	garages: z
		.transform(Number)
		.pipe(z.number().positive("Este campo es requerido")),
	floors: z
		.transform(Number)
		.pipe(z.number().positive("Este campo es requerido")),
	antiquity: z.string().optional(),
	situation: z.string().optional(),
	orientation: z.string().optional(),
	disposition: z.string().optional(),
});

export const pricePropertySchema = z.object({
	price: z
		.transform(Number)
		.pipe(z.number().positive("El precio es requerido")),
	priceCurrency: z.string().min(1, "La moneda del precio es obligatoria"),
	expenses: z
		.transform(Number)
		.pipe(z.number().min(0, "Debe ser mayor o igual a 0")),
	expensesCurrency: z
		.string()
		.min(1, "La moneda de las expensas es obligatoria"),
});

export const surfacesPropertySchema = z.object({
	landArea: z
		.transform(Number)
		.pipe(z.number().positive("Este campo es requerido")),
	coveredArea: z
		.transform(Number)
		.pipe(z.number().positive("Este campo es requerido")),
	semiCoveredArea: z
		.transform(Number)
		.pipe(z.number().positive("Este campo es requerido")),
	totalBuiltArea: z
		.transform(Number)
		.pipe(z.number().positive("Este campo es requerido")),
	uncoveredArea: z
		.transform(Number)
		.pipe(z.number().positive("Este campo es requerido")),
	totalArea: z
		.transform(Number)
		.pipe(z.number().positive("Este campo es requerido")),
});

export const valuesPropertySchema = z.object({
	price: z
		.transform(Number)
		.pipe(z.number().positive("El precio es requerido")),
	priceCurrency: z.string().min(1, "La moneda del precio es obligatoria"),
	expenses: z
		.transform(Number)
		.pipe(z.number().min(0, "Debe ser mayor o igual a 0")),
	expensesCurrency: z
		.string()
		.min(1, "La moneda de las expensas es obligatoria"),
});

export const servicesPropertySchema = z.object({
	services: z.array(z.string()).min(1, "Debe seleccionar al menos un servicio"),
});

export const galleryPropertySchema = z.object({
	thumbnail: z.string().optional(),
	gallery: z
		.array(z.instanceof(File))
		.min(3, "Debes subir al menos 3 imágenes")
		.refine(
			(files) => files.every((file) => file.size <= 3 * 1024 * 1024),
			"El archivo es demasiado grande. El tamaño máximo es 3MB.",
		)
		.default([]),
});

export const documentsPropertySchema = z.object({
	documents: z.array(z.string()).optional(),
	isPublished: z.boolean().default(false).optional(),
});

export const propertySchema = z.object({
	...commonValuesPropertySchema.shape,
	...basicInfoPropertySchema.shape,
	...featuresPropertySchema.shape,
	...pricePropertySchema.shape,
	...surfacesPropertySchema.shape,
	...valuesPropertySchema.shape,
	...servicesPropertySchema.shape,
	...galleryPropertySchema.shape,
	...documentsPropertySchema.shape,
});

export type Property = z.infer<typeof propertySchema>;
export type PropertyBasicInfo = z.infer<typeof basicInfoPropertySchema>;
export type PropertyFeatures = z.infer<typeof featuresPropertySchema>;
export type PropertyPrice = z.infer<typeof pricePropertySchema>;
export type PropertySurfaces = z.infer<typeof surfacesPropertySchema>;
export type PropertyValues = z.infer<typeof valuesPropertySchema>;
export type PropertyServices = z.infer<typeof servicesPropertySchema>;
export type PropertyDocuments = z.infer<typeof documentsPropertySchema>;
export type PropertyGallery = z.infer<typeof galleryPropertySchema>;
