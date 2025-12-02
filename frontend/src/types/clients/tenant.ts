import type { BaseContact } from "./base";

export interface CreateTenant extends BaseContact {
	contact_category: "Inquilino";
	address: string;
	rental_interest: boolean;
	property_interest_phone: string;
}

export interface Tenant extends CreateTenant {
	id: string;
	created_at: string;
	updated_at: string;
}

export type UpdateTenant = Partial<CreateTenant>;
