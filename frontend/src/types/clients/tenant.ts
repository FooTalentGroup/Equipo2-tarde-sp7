import type { BaseContact } from "./base";

export interface CreateTenant extends BaseContact {
	contact_category: "Inquilino";
	address: string;
	rental_interest: boolean;
	property_interest_phone: string;
	property_id?: number;
	property_address?: string;
	contract_start_date?: string;
	contract_end_date?: string;
	next_increase_date?: string;
	monthly_amount?: number;
	currency_type_id?: number;
	currency_type?: string;
	remind_increase?: boolean;
	remind_contract_end?: boolean;
	external_reference?: string;
}

export interface Tenant extends CreateTenant {
	id: string;
	created_at: string;
	updated_at: string;
}

export type UpdateTenant = Partial<CreateTenant>;
