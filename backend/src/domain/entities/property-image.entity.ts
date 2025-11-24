import { CustomError } from "../errors/custom.error";

export class PropertyImageEntity {
    constructor(
        public id: string,
        public property_id: string,
        public image_url: string,
        public is_primary: boolean,
        public created_at?: Date,
    ) {}

    static fromObject(object: { [key: string]: any }): PropertyImageEntity {
        const { 
            id, 
            property_id, 
            image_url,
            is_primary,
            created_at
        } = object;
        
        if (!id) throw CustomError.badRequest('Id is required');
        if (!property_id) {
            throw CustomError.badRequest('Property id is required');
        }
        if (!image_url || image_url.trim().length === 0) {
            throw CustomError.badRequest('Image URL is required');
        }
        
        // Validate URL format
        if (!this.isValidUrl(image_url.trim())) {
            throw CustomError.badRequest('Image URL format is invalid');
        }
        
        // Validate date if it exists
        let createdAt: Date | undefined;
        
        if (created_at) {
            createdAt = created_at instanceof Date ? created_at : new Date(created_at);
            if (isNaN(createdAt.getTime())) {
                throw CustomError.badRequest('Invalid created_at date');
            }
        }

        return new PropertyImageEntity(
            id,
            property_id,
            image_url.trim(),
            Boolean(is_primary),
            createdAt
        );
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

