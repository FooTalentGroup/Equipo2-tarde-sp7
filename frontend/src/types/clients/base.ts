export interface BaseContact {
	first_name: string;
	last_name: string;
	phone: string;
	email: string;
	dni: string;
	notes?: string;
	city: string;
	province: string;
	country: string;
}

export interface BaseContactWithId extends BaseContact {
	id: string;
	created_at: string;
	updated_at: string;
}

export type ContactCategory = "Lead" | "Propietario" | "Inquilino";
