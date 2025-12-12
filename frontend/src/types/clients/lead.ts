import type { BaseContact, ContactCategoryInfo } from "./base";

// Reutilizar tipos de dirección, precio e imagen de Owner
export interface PropertyAddress {
	full_address: string;
	neighborhood: string | null;
	city: {
		id: number;
		name: string;
		province: {
			id: number;
			name: string;
			country: {
				id: number;
				name: string;
			};
		};
	};
	location: {
		latitude: number | null;
		longitude: number | null;
	};
}

export interface PropertyPrice {
	amount: string;
	currency: {
		id: number;
		name: string;
		symbol: string;
	};
	operation_type: {
		id: number;
		name: string;
	};
}

export interface PropertyImage {
	id: number;
	url: string;
	is_primary: boolean;
}

export interface PropertyOfInterest {
	id: number;
	title: string;
	description: string | null;
	surface_area: string;
	bedrooms: number;
	bathrooms: number;
	garage: boolean;
	address: PropertyAddress;
	prices: PropertyPrice[];
	main_image: PropertyImage;
	age: {
		id: number;
		name: string;
	};
	property_type: {
		id: number;
		name: string;
	};
	property_status: {
		id: number;
		name: string;
	};
	interest_created_at: string;
	interest_notes: string | null;
	publication_date: string;
}

export interface CreateLead extends BaseContact {
	contact_category_id?: number;
	interest_zone: string | null;
	purchase_interest?: boolean;
	rental_interest?: boolean;
	property_search_type_id: number | null;
	city_id: number | null;
	property_id?: number;
}

export interface PropertySearchType {
	id: number;
	name: string;
}

export interface City {
	id: number;
	name: string;
}

export interface Lead {
	id: number;
	first_name: string;
	last_name: string;
	phone: string;
	email: string;
	dni: string | null;
	notes: string | null;
	address: string | null;
	property_interest_phone: string | null;
	registered_at: string;
	contact_category_id: number;
	purchase_interest: boolean;
	rental_interest: boolean;
	city_id: number | null;
	interest_zone: string | null;
	property_search_type_id: number | null;
	contact_category: ContactCategoryInfo;
	property_search_type: PropertySearchType | null;
	city: City | null;
}

// Tipo extendido cuando el lead incluye información de propiedades de interés
export interface LeadWithProperties extends Lead {
	properties_of_interest_count?: number; // Conteo de propiedades de interés
}

export type UpdateLead = Partial<CreateLead>;

// Tipo para la respuesta del API con la nueva estructura del backend
export interface LeadApiResponse {
	client: Lead;
	properties_of_interest: PropertyOfInterest[];
	owned_properties: unknown[];
	rented_property: unknown;
}

// Tipo auxiliar para mapear desde el formulario inicial
export interface LeadFormInitialData {
	first_name: string;
	last_name: string;
	phone: string;
	email: string;
	interest_zone: string | null;
	property_search_type_id: number | null;
}
