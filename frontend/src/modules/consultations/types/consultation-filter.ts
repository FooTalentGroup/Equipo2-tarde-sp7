export interface ConsultationFilterForm {
	start_date?: string;
	end_date?: string;
	is_read?: boolean;
	consultation_type_id?: number;
	limit?: number;
	offset?: number;
}
