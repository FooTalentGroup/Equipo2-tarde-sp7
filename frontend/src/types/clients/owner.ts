import type {
	BaseContact,
	BaseContactWithId,
	ContactCategoryInfo,
} from "./base";

export interface OwnedProperty {
	id: number;
	title?: string;
	property_type?: {
		id: number;
		name: string;
	};
	property_status?: {
		id: number;
		name: string;
	};
	publication_date?: string;
}

export interface CreateOwner extends BaseContact {
	contact_category_id?: number;
	purchase_interest?: boolean;
	rental_interest?: boolean;
	city_id?: number | null;
}

export interface Owner extends BaseContactWithId {
	id: number;
	contact_category_id: number;
	purchase_interest: boolean;
	rental_interest: boolean;
	city_id: number | null;
	interest_zone: string | null;
	property_search_type_id: number | null;
	contact_category: ContactCategoryInfo;
	owned_properties: OwnedProperty[];
}

export type UpdateOwner = Partial<CreateOwner>;

// Tipo para la respuesta del API (mantener para compatibilidad con páginas existentes)
export interface OwnerApiResponse {
	id: number;
	first_name: string;
	last_name: string;
	email: string;
	dni: string;
	phone: string;
	property_interest_phone: string | null;
	address: string | null;
	notes: string | null;
	contact_category_id: number;
	interest_zone: string | null;
	purchase_interest: boolean;
	rental_interest: boolean;
	property_search_type_id: number | null;
	city_id: number | null;
	registered_at: string | null;
	contact_category: ContactCategoryInfo;
	properties_of_interest: unknown[];
	owned_properties: OwnedProperty[];
	rented_property: unknown;
}
