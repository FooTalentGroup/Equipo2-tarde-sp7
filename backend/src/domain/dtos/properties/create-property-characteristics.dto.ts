/**
 * DTO para características físicas de la propiedad
 * Also accepts main catalog fields (property_type, property_status, visibility_status)
 * as fallback if not provided in basic
 */
export interface CreatePropertyCharacteristicsDto {
    // Main catalogs (optional, can be in basic or here)
    property_type?: string; // nombre o ID
    property_type_id?: number;
    property_status?: string; // nombre o ID
    property_status_id?: number;
    visibility_status?: string; // nombre o ID
    visibility_status_id?: number;
    
    // Physical characteristics
    rooms_count?: number;
    bedrooms_count?: number;
    bathrooms_count?: number;
    toilets_count?: number;
    parking_spaces_count?: number;
    floors_count?: number;
    age?: string; // nombre o ID
    age_id?: number;
    orientation?: string; // nombre o ID
    orientation_id?: number;
    disposition?: string; // nombre o ID
    disposition_id?: number;
    situation?: string; // nombre o ID
    situation_id?: number;
}



