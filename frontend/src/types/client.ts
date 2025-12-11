export type Client = {
	id: string | number;
	name: string;
	type: "lead" | "inquilino" | "propietario";
	dni: string;
	address: string;
	phone: string | null;
	email: string | null;
	origin: string | null;
	interest: string | null;
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
