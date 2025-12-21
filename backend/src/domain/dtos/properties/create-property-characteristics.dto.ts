export interface CreatePropertyCharacteristicsDto {
    property_type?: string;
    property_type_id?: number;
    property_status?: string;
    property_status_id?: number;
    visibility_status?: string;
    visibility_status_id?: number;
    
    rooms_count?: number;
    bedrooms_count?: number;
    bathrooms_count?: number;
    toilets_count?: number;
    parking_spaces_count?: number;
    floors_count?: number;
    age?: string;
    age_id?: number;
    orientation?: string;
    orientation_id?: number;
    disposition?: string;
    disposition_id?: number;
    situation?: string;
    situation_id?: number;
}



