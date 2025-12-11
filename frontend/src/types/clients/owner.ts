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
