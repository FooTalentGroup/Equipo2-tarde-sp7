// types/consultation.ts

export interface ConsultationClient {
	id: number;
	first_name: string;
	last_name: string;
	email: string;
	phone: string;
}

export interface ConsultationProperty {
	id: number;
	title: string;
}

export interface ConsultationType {
	id: number;
	name: string;
}

export interface Consultation {
	consultant?: ConsultationClient;
	id: number;
	consultation_date: string;
	message: string;
	response: string | null;
	response_date: string | null;
	is_read: boolean;
	client: ConsultationClient;
	property: ConsultationProperty;
	consultation_type: ConsultationType;
}

export interface ConsultationFilters {
	days?: 7 | 30 | null;
	unread?: boolean;
	all?: boolean;
}
