export class CreateFullPropertyDto {
    constructor(
        public readonly propertyDetails: {
            title: string;
            price: number;
            bedrooms?: number;
            bathrooms?: number;
            description?: string;
            status_id?: string;
            property_type_id?: string;
            operation_type_id?: string;
        },
        public readonly location: {
            country: string;
            city: string;
            department: string;
            street: string;
            number?: string;
        },
        public readonly image_url?: string,
        public readonly image_file?: string, // Base64 string (para compatibilidad)
        public readonly property_file?: Buffer, // Archivo real (Buffer de multer)
    ){}

    static create( object: { [key: string]: any }, file?: Express.Multer.File): [string?, CreateFullPropertyDto?] {
        const { propertyDetails, location, image_url, image_file } = object;
        
        // Validar propertyDetails
        if (!propertyDetails) {
            return ['Property details are required. Send propertyDetails as JSON string in FormData.', undefined];
        }
        
        if (typeof propertyDetails !== 'object') {
            return [`Property details must be an object, received: ${typeof propertyDetails}`, undefined];
        }
        
        if (!propertyDetails.title || propertyDetails.title.trim().length === 0) {
            return ['Property title is required', undefined];
        }
        
        if (propertyDetails.title.trim().length < 3) {
            return ['Property title must be at least 3 characters', undefined];
        }
        
        if (propertyDetails.price === undefined || propertyDetails.price === null) {
            return ['Property price is required', undefined];
        }
        
        if (typeof propertyDetails.price !== 'number' || propertyDetails.price <= 0) {
            return ['Property price must be a positive number', undefined];
        }
        
        if (propertyDetails.bedrooms !== undefined && (propertyDetails.bedrooms < 0 || !Number.isInteger(propertyDetails.bedrooms))) {
            return ['Bedrooms must be a non-negative integer', undefined];
        }
        
        if (propertyDetails.bathrooms !== undefined && (propertyDetails.bathrooms < 0)) {
            return ['Bathrooms must be a non-negative number', undefined];
        }
        
        // Validar location
        if (!location) {
            return ['Location is required. Send location as JSON string in FormData.', undefined];
        }
        
        if (typeof location !== 'object') {
            return [`Location must be an object, received: ${typeof location}`, undefined];
        }
        
        if (!location.country || location.country.trim().length === 0) {
            return ['Country is required', undefined];
        }
        
        if (!location.city || location.city.trim().length === 0) {
            return ['City is required', undefined];
        }
        
        if (!location.department || location.department.trim().length === 0) {
            return ['Department is required', undefined];
        }
        
        if (!location.street || location.street.trim().length === 0) {
            return ['Street is required', undefined];
        }
        
        // Validar imagen
        // Puede venir como: image_url, image_file (base64), o property_file (archivo real)
        if (!image_url && !image_file && !file) {
            return ['Either image_url, image_file (base64), or property_file (file) is required', undefined];
        }
        
        if (image_file && typeof image_file !== 'string') {
            return ['image_file must be a base64 string', undefined];
        }
        
        // Validar que el archivo sea una imagen
        if (file && !file.mimetype.startsWith('image/')) {
            return ['property_file must be an image file', undefined];
        }

        return [
            undefined, 
            new CreateFullPropertyDto(
                {
                    title: propertyDetails.title.trim(),
                    price: propertyDetails.price,
                    bedrooms: propertyDetails.bedrooms,
                    bathrooms: propertyDetails.bathrooms,
                    description: propertyDetails.description?.trim() || undefined,
                    status_id: propertyDetails.status_id || undefined,
                    property_type_id: propertyDetails.property_type_id || undefined,
                    operation_type_id: propertyDetails.operation_type_id || undefined,
                },
                {
                    country: location.country.trim(),
                    city: location.city.trim(),
                    department: location.department.trim(),
                    street: location.street.trim(),
                    number: location.number?.trim() || undefined,
                },
                image_url?.trim() || undefined,
                image_file || undefined,
                file?.buffer || undefined // Buffer del archivo subido
            )
        ];
    }
}

