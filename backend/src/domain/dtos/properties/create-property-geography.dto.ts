/**
 * DTO para datos geográficos de una propiedad
 * Adaptado a la nueva estructura: country -> province -> city
 */
export class CreatePropertyGeographyDto {
    constructor(
        public readonly country: string,
        public readonly province: string,
        public readonly city: string,
    ) {}

    static create(object: Record<string, unknown>): [string?, CreatePropertyGeographyDto?] {
        const { country, province, city } = object;

        if (!country || typeof country !== 'string' || country.trim().length === 0) {
            return ['Country is required', undefined];
        }
        if (!province || typeof province !== 'string' || province.trim().length === 0) {
            return ['Province is required', undefined];
        }
        if (!city || typeof city !== 'string' || city.trim().length === 0) {
            return ['City is required', undefined];
        }

        return [
            undefined,
            new CreatePropertyGeographyDto(
                country.trim(),
                province.trim(),
                city.trim()
            )
        ];
    }
}





