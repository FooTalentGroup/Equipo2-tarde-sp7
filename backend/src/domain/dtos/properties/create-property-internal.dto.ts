/**
 * DTO para información interna de la propiedad
 */
export interface CreatePropertyInternalDto {
    branch_name?: string;
    appraiser?: string;
    producer?: string;
    maintenance_user?: string;
    keys_location?: string;
    internal_comments?: string;
    social_media_info?: string;
    operation_commission_percentage?: number;
    producer_commission_percentage?: number;
}




