export class CreatePropertyImageDto {
    constructor(
        public readonly property_id: string,
        public readonly image_url: string,
        public readonly is_primary?: boolean,
    ){}

    static create( object: { [key: string]: any }): [string?, CreatePropertyImageDto?] {
        const { property_id, image_url, is_primary } = object;
        
        // Validar campos requeridos
        if (!property_id || property_id.trim().length === 0) {
            return ['Property id is required', undefined];
        }
        if (!image_url || image_url.trim().length === 0) {
            return ['Image URL is required', undefined];
        }
        
        // Validar formato de URL
        if (!this.isValidUrl(image_url.trim())) {
            return ['Image URL format is invalid', undefined];
        }

        return [
            undefined, 
            new CreatePropertyImageDto(
                property_id.trim(),
                image_url.trim(),
                is_primary !== undefined ? Boolean(is_primary) : undefined
            )
        ];
    }

    private static isValidUrl(url: string): boolean {
        try {
            new URL(url);
            return true;
        } catch {
            // Also accept relative paths
            return url.startsWith('/') || url.startsWith('./') || url.startsWith('../');
        }
    }
}

