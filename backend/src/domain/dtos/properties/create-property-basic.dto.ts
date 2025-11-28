/**
 * DTO para información básica de la propiedad
 */
export interface CreatePropertyBasicDto {
    title: string;
    description?: string;
    property_type?: string; // nombre o ID
    property_type_id?: number;
    property_status?: string; // nombre o ID
    property_status_id?: number;
    visibility_status?: string; // nombre o ID
    visibility_status_id?: number;
    //owner_id: number; // ID del cliente propietario
    owner_id?: number,  // ← Hacer opcional
    featured_web?: boolean;
    publication_date?: Date | string;
}




