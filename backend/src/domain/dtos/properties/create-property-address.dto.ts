/**
 * DTO para dirección de una propiedad
 */
export class CreatePropertyAddressDto {
    constructor(
        public readonly street: string,
        public readonly number?: string,
        public readonly neighborhood?: string,
        public readonly postal_code?: string,
        public readonly latitude?: number,
        public readonly longitude?: number,
    ) {}

    static create(object: Record<string, unknown>): [string?, CreatePropertyAddressDto?] {
        const { street, number, neighborhood, postal_code, latitude, longitude } = object;

        if (!street || typeof street !== 'string' || street.trim().length === 0) {
            return ['Street is required', undefined];
        }

        // Validar coordenadas si se proporcionan
        if (latitude !== undefined && latitude !== null && (typeof latitude !== 'number' || isNaN(Number(latitude)) || Number(latitude) < -90 || Number(latitude) > 90)) {
            return ['Latitude must be a number between -90 and 90', undefined];
        }
        if (longitude !== undefined && longitude !== null && (typeof longitude !== 'number' || isNaN(Number(longitude)) || Number(longitude) < -180 || Number(longitude) > 180)) {
            return ['Longitude must be a number between -180 and 180', undefined];
        }

        return [
            undefined,
            new CreatePropertyAddressDto(
                street.trim(),
                (number as string | undefined)?.trim(),
                (neighborhood as string | undefined)?.trim(),
                (postal_code as string | undefined)?.trim(),
                latitude !== undefined ? Number(latitude) : undefined,
                longitude !== undefined ? Number(longitude) : undefined,
            )
        ];
    }
}





