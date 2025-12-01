import { z } from "zod";

export const PropertyStatus = {
	AVAILABLE: "Disponible",
	UNAVAILABLE: "No Disponible",
} as const;

export const propertyStatusEnum = z.enum(["Disponible", "No Disponible"]);
export type PropertyStatusType = z.infer<typeof propertyStatusEnum>;

export const VisibilityStatus = {
	PUBLISHED: "Publicado",
	NOT_PUBLISHED: "No Publicado",
} as const;

export const visibilityStatusEnum = z.enum(["Publicado", "No Publicado"]);
export type VisibilityStatusType = z.infer<typeof visibilityStatusEnum>;

export const PropertyType = {
	APARTMENT: "apartment",
	HOUSE: "house",
	PH: "ph",
	LAND: "land",
	COMMERCIAL: "commercial",
	OFFICE: "office",
} as const;

export const basicSchema = z.object({
	title: z.string().min(3, "El título es obligatorio"),
	description: z.string().optional(),
	property_type: z.string().min(1, "El tipo de propiedad es obligatorio"),
	property_status: z.string().optional(),
	visibility_status: visibilityStatusEnum.optional(),
	featured_web: z.boolean().optional(),
	publication_date: z.string().optional(),
	owner_id: z.string().min(1, "El propietario es obligatorio"),
});

export const geographySchema = z.object({
	country: z.string().min(1, "El país es obligatorio"),
	province: z.string().min(1, "La provincia es obligatoria"),
	city: z.string().min(1, "La ciudad es obligatoria"),
});

export const addressSchema = z.object({
	street: z.string().min(1, "La calle es obligatoria"),
	number: z.string().optional(),
	floor: z.string().min(1, "El piso es obligatorio").optional(),
	neighborhood: z.string().optional(),
	postal_code: z.string().min(1, "El código postal es obligatorio"),
	latitude: z.number().optional(),
	longitude: z.number().optional(),
});

export const priceSchema = z.object({
	price: z
		.transform(Number)
		.pipe(z.number().positive("El precio es obligatorio")),
	currency_symbol: z.string().min(1, "La moneda es obligatoria"),
	operation_type: z.string().min(1, "El tipo de operación es obligatorio"),
});

export const expenseSchema = z.object({
	amount: z
		.transform(Number)
		.pipe(z.number().positive("El monto es obligatorio")),
	currency_symbol: z.string().min(1, "La moneda es obligatoria"),
	frequency: z.string().optional(),
});

export const valuesSchema = z.object({
	prices: z.array(priceSchema).min(1, "Debe haber al menos un precio"),
	expenses: z.array(expenseSchema).min(1, "Debe haber al menos un gasto"),
});

export const characteristicsSchema = z.object({
	rooms_count: z
		.transform(Number)
		.pipe(z.number().positive("El número de habitaciones es obligatorio")),
	bedrooms_count: z
		.transform(Number)
		.pipe(z.number().positive("El número de dormitorios es obligatorio")),
	bathrooms_count: z
		.transform(Number)
		.pipe(z.number().positive("El número de baños es obligatorio")),
	toilets_count: z
		.transform(Number)
		.pipe(z.number().positive("El número de wc es obligatorio")),
	parking_spaces_count: z
		.transform(Number)
		.pipe(z.number().positive("El número de garajes es obligatorio")),
	floors_count: z
		.transform(Number)
		.pipe(z.number().positive("El número de pisos es obligatorio")),
	situation: z.string().optional(),
	age: z.string().optional(),
	orientation: z.string().optional(),
	disposition: z.string().optional(),
	zoning: z.string().optional(),
});

export const surfaceSchema = z.object({
	land_area: z
		.transform(Number)
		.pipe(z.number().positive("El área de la parcela es obligatoria")),
	semi_covered_area: z
		.transform(Number)
		.pipe(z.number().positive("El área semi cubierta es obligatoria")),
	covered_area: z
		.transform(Number)
		.pipe(z.number().positive("El área cubierta es obligatoria")),
	total_built_area: z
		.transform(Number)
		.pipe(z.number().positive("El área total construida es obligatoria")),
	uncovered_area: z
		.transform(Number)
		.pipe(z.number().positive("El área no cubierta es obligatoria")),
	total_area: z
		.transform(Number)
		.pipe(z.number().positive("El área total es obligatoria")),
	zoning: z.string().optional(),
});

export const servicesSchema = z.object({
	services: z.array(z.string()).optional(),
});

export const internalSchema = z.object({
	branch_name: z.string().optional(),
	appraiser: z.string().optional(),
	producer: z.string().optional(),
	maintenance_user: z.string().optional(),
	keys_location: z.string().optional(),
	internal_comments: z.string().optional(),
	social_media_info: z.string().optional(),
	operation_commission_percentage: z.number().min(0).optional(),
	producer_commission_percentage: z.number().min(0).optional(),
});

export const imagesSchema = z.object({
	gallery: z.array(z.any()).optional(),
});

export const documentsSchema = z.object({
	files: z.array(z.any()).optional(),
});

export const propertySchema = z.object({
	basic: basicSchema,
	geography: geographySchema,
	address: addressSchema,
	values: valuesSchema,
	characteristics: characteristicsSchema,
	surface: surfaceSchema,
	services: servicesSchema,
	internal: internalSchema,
	images: imagesSchema.optional(),
	documents: documentsSchema.optional(),
});

export type Property = z.infer<typeof propertySchema>;
export type PropertyBasic = z.infer<typeof basicSchema>;
export type PropertyGeography = z.infer<typeof geographySchema>;
export type PropertyAddress = z.infer<typeof addressSchema>;
export type PropertyValues = z.infer<typeof valuesSchema>;
export type PropertyCharacteristics = z.infer<typeof characteristicsSchema>;
export type PropertySurface = z.infer<typeof surfaceSchema>;
export type PropertyServices = z.infer<typeof servicesSchema>;
export type PropertyInternal = z.infer<typeof internalSchema>;
