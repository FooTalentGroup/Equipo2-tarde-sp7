export interface PropertyDetail {
	id: number;
	title: string;
	description: string | null;
	publication_date: string;
	featured_web: boolean;
	visibility_status_id: number;
	captured_by_user_id: number;
	branch_name: string | null;
	appraiser: string | null;
	producer: string | null;
	maintenance_user: string | null;
	keys_location: string | null;
	internal_comments: string | null;
	social_media_info: string | null;
	operation_commission_percentage: string;
	producer_commission_percentage: string;
	land_area: string;
	semi_covered_area: string;
	covered_area: string;
	total_built_area: string;
	uncovered_area: string;
	total_area: string;
	rooms_count: number;
	bedrooms_count: number;
	bathrooms_count: number;
	toilets_count: number;
	parking_spaces_count: number;
	floors_count: number;
	zoning: string | null;
	property_type_id: number;
	property_status_id: number;
	owner_id: number;
	situation_id: number;
	age_id: number;
	orientation_id: number;
	disposition_id: number;
	updated_at: string;
	addresses: Address[];
	prices: Price[];
	images: PropertyImage[];
	property_type: NamedItem;
	property_status: NamedItem;
	visibility_status: NamedItem;
	owner: Owner;
	age: NamedItem;
	orientation: NamedItem;
	disposition: NamedItem;
	situation: NamedItem;
	services: NamedItem[];
	documents: unknown[];
	expenses: Expense[];
	active_tenant: unknown | null;
}

export interface Address {
	id: number;
	full_address: string;
	neighborhood: string | null;
	postal_code: string;
	latitude: number | null;
	longitude: number | null;
	city: City;
}

export interface City {
	id: number;
	name: string;
	province: Province;
}

export interface Province {
	id: number;
	name: string;
	country: NamedItem;
}

export interface Price {
	id: number;
	property_id: number;
	price: string;
	currency: Currency;
	operation_type: NamedItem;
	updated_at: string;
}

export interface Currency {
	id: number;
	name: string;
	symbol: string;
}

export interface PropertyImage {
	id: number;
	property_id: number;
	file_path: string;
	media_type: string;
	is_primary: boolean;
}

export interface NamedItem {
	id: number;
	name: string;
}

export interface Owner {
	id: number;
	first_name: string;
	last_name: string;
	name: string;
	email: string;
	phone: string;
	dni: string | null;
}

export interface Expense {
	id: number;
	property_id: number;
	amount: string;
	currency: Currency;
	frequency: string;
	registered_date: string;
}

export interface PropertyDetailResponse {
	property: PropertyDetail;
}
