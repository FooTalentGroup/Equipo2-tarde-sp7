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

    static create(object: { [key: string]: any }): [string?, CreatePropertyAddressDto?] {
        const { street, number, neighborhood, postal_code, latitude, longitude } = object;

        if (!street || street.trim().length === 0) {
            return ['Street is required', undefined];
        }

        // Validar coordenadas si se proporcionan
        if (latitude !== undefined && (isNaN(latitude) || latitude < -90 || latitude > 90)) {
            return ['Latitude must be a number between -90 and 90', undefined];
        }
        if (longitude !== undefined && (isNaN(longitude) || longitude < -180 || longitude > 180)) {
            return ['Longitude must be a number between -180 and 180', undefined];
        }

        return [
            undefined,
            new CreatePropertyAddressDto(
                street.trim(),
                number?.trim(),
                neighborhood?.trim(),
                postal_code?.trim(),
                latitude !== undefined ? Number(latitude) : undefined,
                longitude !== undefined ? Number(longitude) : undefined,
            )
        ];
    }
}





