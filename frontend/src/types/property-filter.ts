export type PropertyFilterForm = {
	property_type_id?: string;
	min_price?: string;
	max_price?: string;
	search?: string;
	includeArchived?: boolean;
	operation_type_id?: string;
	featured_web?: boolean;
	limit?: number;
	offset?: number;
};
