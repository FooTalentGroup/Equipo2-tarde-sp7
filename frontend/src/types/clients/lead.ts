import type {
	BaseContact,
	BaseContactWithId,
	ContactCategoryInfo,
} from "./base";

export interface PropertyOfInterest {
	id: number;
	title: string;
	property_type: {
		id: number;
		name: string;
	};
	property_status: {
		id: number;
		name: string;
	};
	interest_created_at: string;
	interest_notes?: string | null;
}

export interface CreateLead extends BaseContact {
	contact_category_id?: number;
	interest_zone: string | null;
	purchase_interest?: boolean;
	rental_interest?: boolean;
	property_search_type_id: number | null;
	city_id: number | null;
}

export interface Lead extends BaseContactWithId {
	id: number;
	contact_category_id: number;
	interest_zone: string | null;
	purchase_interest: boolean;
	rental_interest: boolean;
	property_search_type_id: number | null;
	city_id: number | null;
	contact_category: ContactCategoryInfo;
	properties_of_interest: PropertyOfInterest[];
}

export type UpdateLead = Partial<CreateLead>;

// Tipo auxiliar para mapear desde el formulario inicial
export interface LeadFormInitialData {
	first_name: string;
	last_name: string;
	phone: string;
	email: string;
	interest_zone: string | null;
	property_search_type_id: number | null;
}
