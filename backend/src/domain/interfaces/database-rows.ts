/**
 * Tipos para filas de base de datos
 * Estos tipos representan la estructura de datos que viene de la DB
 */

export interface PropertyPriceRow {
	id: number;
	property_id: number;
	price: number;
	currency_type_id: number;
	operation_type_id: number;
	updated_at?: Date;
}

export interface PropertyAddressRow {
	id: number;
	property_id?: number;
	address_id?: number;
	street?: string;
	number?: string;
	full_address: string;
	neighborhood?: string;
	postal_code?: string;
	latitude?: number;
	longitude?: number;
	city_id: number;
}

export interface PropertyServiceRow {
	id: number;
	property_id: number;
	service_id: number;
}

export interface ExpenseRow {
	id: number;
	property_id: number;
	amount: number;
	currency_type_id: number;
	frequency?: string;
	registered_date: Date;
}

export interface ConsultationRow {
	id: number;
	client_id?: number;
	property_id?: number;
	consultation_type_id: number;
	consultation_date: Date;
	message: string;
	response?: string;
	response_date?: Date;
	is_read: boolean;
}

export interface PropertyRow {
	id: number;
	title: string;
	description?: string;
	property_type_id: number;
	property_status_id: number;
	visibility_status_id: number;
	owner_id?: number;
	bedrooms_count?: number;
	bathrooms_count?: number;
	total_area?: number;
	parking_spaces_count?: number;
	age_id?: number;
	// Campos adicionales que pueden ser necesarios
	rooms_count?: number;
	toilets_count?: number;
	floors_count?: number;
	land_area?: number;
	covered_area?: number;
	publication_date?: Date;
}

export interface RentalInfoRow {
	id: number;
	client_rental_id: number;
	property_id: number;
	monthly_amount: number;
	currency_type_id: number;
	next_increase_date?: Date;
	end_date?: Date;
}
