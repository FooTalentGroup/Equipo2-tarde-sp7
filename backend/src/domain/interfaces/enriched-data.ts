/**
 * Interfaces para datos enriquecidos
 * Estos tipos representan datos después de hacer JOINs y agregar información relacionada
 * A diferencia de los tipos Row, estos incluyen objetos anidados completos
 */

// ============================================================================
// Interfaces auxiliares para objetos anidados comunes
// ============================================================================

export interface CurrencyInfo {
	id: number | undefined;
	name: string;
	symbol: string;
}

export interface OperationTypeInfo {
	id: number | undefined;
	name: string;
}

export interface PropertyTypeInfo {
	id: number | undefined;
	name: string;
}

export interface PropertyStatusInfo {
	id: number | undefined;
	name: string;
}

export interface VisibilityStatusInfo {
	id: number | undefined;
	name: string;
}

export interface PropertyAgeInfo {
	id: number | undefined;
	name: string;
}

export interface OrientationInfo {
	id: number | undefined;
	name: string;
}

export interface DispositionInfo {
	id: number | undefined;
	name: string;
}

export interface SituationInfo {
	id: number | undefined;
	name: string;
}

export interface ServiceInfo {
	id: number | undefined;
	name: string;
}

export interface CountryInfo {
	id: number | undefined;
	name: string;
}

export interface ProvinceInfo {
	id: number | undefined;
	name: string;
	country: CountryInfo | null;
}

export interface CityInfo {
	id: number | undefined;
	name: string;
	province: ProvinceInfo | null;
}

export interface ContactCategoryInfo {
	id: number | undefined;
	name: string;
}

// ============================================================================
// Interfaces para datos enriquecidos de Property
// ============================================================================

export interface EnrichedPropertyPrice {
	id?: number;
	property_id: number;
	price: number;
	currency: CurrencyInfo | null;
	operation_type: OperationTypeInfo | null;
	updated_at?: Date;
}

export interface EnrichedPropertyAddress {
	id?: number;
	street: string | null;
	number: string | null;
	full_address: string;
	neighborhood?: string | null;
	postal_code?: string | null;
	latitude?: number | null;
	longitude?: number | null;
	city: CityInfo | null;
}

export interface EnrichedExpense {
	id?: number;
	property_id: number;
	amount: number;
	currency: CurrencyInfo | null;
	frequency: string | null;
	registered_date: Date;
}

export interface EnrichedPropertyService {
	id?: number;
	name: string;
}

export interface EnrichedPropertyDocument {
	id?: number;
	property_id: number;
	file_path: string;
	document_type: string;
	uploaded_at?: Date;
}

export interface EnrichedPropertyMultimedia {
	id?: number;
	property_id: number;
	file_path: string;
	media_type: string;
	is_primary: boolean;
	uploaded_at?: Date;
}

// ============================================================================
// Interfaces para datos enriquecidos de Client
// ============================================================================

export interface EnrichedClient {
	id: number;
	first_name: string;
	last_name: string;
	email: string | null;
	phone: string | null;
	dni: string | null;
	address: string | null;
	contact_category: ContactCategoryInfo | null;
	registered_at?: Date;
}

export interface EnrichedConsultation {
	id: number;
	consultation_date: Date;
	message: string;
	response: string | null;
	response_date: Date | null;
	is_read: boolean;
	consultation_type: {
		id: number;
		name: string;
	} | null;
	property: {
		id: number;
		title: string;
	} | null;
}

// ============================================================================
// Interfaces para resultados de consultas SQL con JOINs
// ============================================================================

export interface ConsultationQueryRow {
	id: number;
	consultation_date: Date;
	message: string;
	response?: string;
	response_date?: Date;
	is_read: boolean;
	// Datos del cliente (si existe)
	client_id?: number;
	client_first_name?: string;
	client_last_name?: string;
	client_email?: string;
	client_phone?: string;
	// Datos del consultante (si no hay cliente)
	consultant_first_name?: string;
	consultant_last_name?: string;
	consultant_email?: string;
	consultant_phone?: string;
	// Datos de la propiedad
	property_id?: number;
	property_title?: string;
	// Tipo de consulta
	consultation_type_id: number;
	consultation_type_name: string;
}

// ============================================================================
// Interfaces para Property con datos completos (para listados)
// ============================================================================

export interface PropertyListItem {
	id: number;
	title: string;
	description?: string;
	bedrooms_count?: number;
	bathrooms_count?: number;
	total_area?: number;
	parking_spaces_count?: number;
	featured_web?: boolean;
	publication_date?: Date;
	updated_at?: Date;
	// IDs de catálogos (necesarios para algunas operaciones)
	property_type_id?: number;
	property_status_id?: number;
	visibility_status_id?: number;
	owner_id?: number;
	age_id?: number;
	// Catálogos enriquecidos (nombres)
	property_type_name?: string;
	property_status_name?: string;
	visibility_status_name?: string;
	property_age_name?: string;
	orientation_id?: number;
	orientation_name?: string;
	disposition_id?: number;
	disposition_name?: string;
	situation_id?: number;
	situation_name?: string;
	// Campos adicionales
	rooms_count?: number;
	land_area?: number;
	covered_area?: number;
	// Precio principal
	main_price?: number;
	main_currency_type_id?: number;
	main_operation_type_id?: number;
	// Dirección principal
	main_address?: string;
	main_neighborhood?: string;
	main_city_name?: string;
	main_city_id?: number;
	main_province_name?: string;
	// Imagen principal
	primary_image_id?: number;
	primary_image_path?: string;
	images_count?: number;
}

// ============================================================================
// Interfaces para respuestas de Property Details
// ============================================================================

export interface PropertyDetails {
	description?: string;
	surface_area?: number;
	bedrooms?: number;
	bathrooms?: number;
	garage: boolean;
	address: (EnrichedPropertyAddress & {
		location?: {
			latitude: number | null;
			longitude: number | null;
		};
	}) | null;
	prices: Array<{
		amount: number;
		currency: CurrencyInfo | null;
		operation_type: OperationTypeInfo | null;
	}>;
	main_image: {
		id?: number;
		url: string;
		is_primary: boolean;
	} | null;
	age: PropertyAgeInfo | null;
}

// ============================================================================
// Interfaces para Rental
// ============================================================================

export interface EnrichedRental {
	id?: number;
	contract_start_date: Date | null;
	contract_end_date: Date | null;
	next_increase_date: Date | null;
	monthly_amount: number;
	currency: CurrencyInfo | null;
	external_reference: string | null;
}

// ============================================================================
// Interfaces para Client.services - Propiedades enriquecidas con detalles completos
// ============================================================================

export interface EnrichedPropertyWithDetails {
	id?: number;
	title: string;
	description?: string;
	surface_area?: number;
	bedrooms?: number;
	bathrooms?: number;
	garage: boolean;
	address: EnrichedPropertyAddress | null;
	prices: Array<{
		amount: number;
		currency: CurrencyInfo | null;
		operation_type: OperationTypeInfo | null;
	}>;
	main_image: {
		id?: number;
		url: string;
		is_primary: boolean;
	} | null;
	age: PropertyAgeInfo | null;
	property_type: PropertyTypeInfo | null;
	property_status: PropertyStatusInfo | null;
}

export interface PropertyOfInterest extends EnrichedPropertyWithDetails {
	interest_created_at?: Date;
	interest_notes?: string;
}

export interface RentedPropertyWithDetails extends EnrichedPropertyWithDetails {
	rental: EnrichedRental;
}

export interface OwnedPropertyWithDetails extends EnrichedPropertyWithDetails {
	publication_date?: Date;
}

