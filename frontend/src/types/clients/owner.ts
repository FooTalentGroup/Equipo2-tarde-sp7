import type { BaseContact, ContactCategoryInfo } from "./base";

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

export interface OwnedProperty {
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
	publication_date: string;
}

export interface CreateOwner extends BaseContact {
	contact_category_id?: number;
	purchase_interest?: boolean;
	rental_interest?: boolean;
	city_id?: number | null;
}

export interface PropertySearchType {
	id: number;
	name: string;
}

export interface City {
	id: number;
	name: string;
}

export interface Owner {
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

// Tipo extendido cuando el owner incluye información de propiedades (para listas)
export interface OwnerWithProperties extends Owner {
	owned_properties_count?: number; // Conteo de propiedades para listas
}

export type UpdateOwner = Partial<CreateOwner>;

// Tipo para la respuesta del API con la nueva estructura del backend
export interface OwnerApiResponse {
	client: Owner;
	properties_of_interest: unknown[];
	owned_properties: OwnedProperty[];
	rented_property: unknown;
}
