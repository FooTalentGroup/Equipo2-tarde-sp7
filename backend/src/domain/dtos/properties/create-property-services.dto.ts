/**
 * DTO para servicios de la propiedad
 * Se envía array de nombres de servicios, se crean automáticamente si no existen
 */
export interface CreatePropertyServicesDto {
    services?: string[]; // Nombres de servicios (ej: "Agua potable", "Gas natural", "Piscina")
}




