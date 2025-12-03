import type { BaseContact } from "./base";

export interface CreateLead extends BaseContact {
	contact_category: "Lead";
	interest_zone: string;
	purchase_interest: boolean;
	rental_interest: boolean;
	property_search_type: string;
}

export interface Lead extends CreateLead {
	id: string;
	created_at: string;
	updated_at: string;
}

export type UpdateLead = Partial<CreateLead>;

// Tipo auxiliar para mapear desde el formulario inicial
export interface LeadFormInitialData {
	first_name: string;
	last_name: string;
	phone: string;
	email: string;
	consultation_type: "rental" | "sale" | "purchase";
	interest_zone: string;
}
