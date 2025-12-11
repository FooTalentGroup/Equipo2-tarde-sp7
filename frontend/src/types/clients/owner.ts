import type { BaseContact } from "./base";

type BaseContactOptionalLocation = Omit<
	BaseContact,
	"city" | "province" | "country"
> & {
	city?: string;
	province?: string;
	country?: string;
};

export interface CreateOwner extends BaseContactOptionalLocation {
	contact_category: "Propietario";
	address: string;
	property_id?: number;
}

export interface Owner extends CreateOwner {
	id: string;
	created_at: string;
	updated_at: string;
	property_count?: number;
}

export type UpdateOwner = Partial<CreateOwner>;

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

export interface ContactCategoryRef {
	id: number;
	name: string;
}

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
	city?: string | null;
	province?: string | null;
	country?: string | null;
	city_id?: number | null;
	registered_at: string | null;
	contact_category: ContactCategoryRef;
	properties_of_interest: unknown[];
	owned_properties: OwnedProperty[];
	rented_property: unknown;
}
