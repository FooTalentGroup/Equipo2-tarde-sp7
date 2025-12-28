export interface CreatePropertyBasicDto {
    title: string;
    description?: string;
    property_type?: string;
    property_type_id?: number;
    property_status?: string;
    property_status_id?: number;
    visibility_status?: string;
    visibility_status_id?: number;
    owner_id?: number;
    featured_web?: boolean;
    publication_date?: Date | string;
}




