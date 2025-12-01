export type Client = {
	id: number;
	first_name: string;
	last_name: string;
	email: string | null;
	dni: string | null;
	phone: string | null;
	property_interest_phone: string | null;
	address: string | null;
	notes: string | null;
	contact_category_id: number;
	interest_zone: string | null;
	purchase_interest: boolean;
	rental_interest: boolean;
	property_search_type_id: number | null;
	city_id: number | null;
	registered_at: string;
	contact_category: {
		id: number;
		name: string;
	};
	name: string;
};

export type ClientData = {
	name: string;
	email: string;
	number: number;
};

export type PaymentHistory = {
	month: string;
	amount: number;
	status: "paid" | "pending" | "overdue";
	date: string;
	notes?: string;
};

export type Tenant = {
	name: string;
	dni: string;
	address: string;
	phone?: string;
	email?: string;
	type: string;
	rentAmount: number;
	nextIncrease?: {
		date: string;
		amount: number;
	};
	currentPayment: {
		amount: number;
		dueDate: string;
		status: "paid" | "pending" | "overdue";
	};
	paymentHistory: PaymentHistory[];
};
