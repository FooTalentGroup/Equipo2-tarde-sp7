import type {
	BaseContact,
	BaseContactWithId,
	ContactCategoryInfo,
} from "./base";

export interface RentalInfo {
	id: number;
	contract_start_date: string;
	contract_end_date: string;
	next_increase_date: string;
	monthly_amount: number | null;
	currency: string | null;
	external_reference: string | null;
}

export interface RentedProperty {
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
	rental: RentalInfo;
}

export interface CreateTenant extends BaseContact {
	contact_category_id?: number;
	rental_interest?: boolean;
	purchase_interest?: boolean;
	city_id?: number | null;
}

export interface Tenant extends BaseContactWithId {
	id: number;
	contact_category_id: number;
	rental_interest: boolean;
	purchase_interest: boolean;
	city_id: number | null;
	interest_zone: string | null;
	property_search_type_id: number | null;
	contact_category: ContactCategoryInfo;
	rented_property: RentedProperty | null;
}

export type UpdateTenant = Partial<CreateTenant>;
