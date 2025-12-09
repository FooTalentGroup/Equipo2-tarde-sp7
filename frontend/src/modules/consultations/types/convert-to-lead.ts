export type ConvertToLeadResponse = {
	message: string;
	consultation: {
		id: number;
		client_id: number | null;
		property_id: number | null;
		consultation_date: string;
		consultation_type_id: number | null;
		assigned_user_id: number | null;
		message: string;
		response: string | null;
		responded_by_user_id: number | null;
		response_date: string | null;
		is_read: boolean;
		consultant_first_name: string | null;
		consultant_last_name: string | null;
		consultant_phone: string | null;
		consultant_email: string | null;
	};
	client: {
		id: number;
		first_name: string;
		last_name: string;
		email: string;
		phone: string;
	};
	was_new_lead: boolean;
};
