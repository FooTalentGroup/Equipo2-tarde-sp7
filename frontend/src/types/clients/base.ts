export interface BaseContact {
	first_name: string;
	last_name: string;
	phone: string;
	email: string;
	dni: string | null;
	notes?: string | null;
	city?: string | null;
	province?: string | null;
	country?: string | null;
	address?: string | null;
	property_interest_phone?: string | null;
}

export interface BaseContactWithId extends BaseContact {
	id: number;
	registered_at: string;
}

export interface ContactCategoryInfo {
	id: number;
	name: "Lead" | "Propietario" | "Inquilino";
}

export type ContactCategory = "Lead" | "Propietario" | "Inquilino";
