export class CreatePropertyDto {
    constructor(
        public readonly title: string,
        public readonly price: number,
        public readonly owner_id: string,
        public readonly address_id: string,
        public readonly description?: string,
        public readonly bedrooms?: number,
        public readonly bathrooms?: number,
        public readonly client_id?: string,
        public readonly status_id?: string,
        public readonly property_type_id?: string,
        public readonly operation_type_id?: string,
    ){}

    static create( object: { [key: string]: any }): [string?, CreatePropertyDto?] {
        const { 
            title, 
            description,
            price,
            bedrooms,
            bathrooms,
            owner_id,
            client_id,
            address_id,
            status_id,
            property_type_id,
            operation_type_id
        } = object;
        
        // Validar campos requeridos
        if (!title || title.trim().length === 0) {
            return ['Title is required', undefined];
        }
        if (price === undefined || price === null) {
            return ['Price is required', undefined];
        }
        if (typeof price !== 'number' && isNaN(Number(price))) {
            return ['Price must be a valid number', undefined];
        }
        if (Number(price) < 0) {
            return ['Price must be greater than or equal to 0', undefined];
        }
        if (!owner_id || owner_id.trim().length === 0) {
            return ['Owner id is required', undefined];
        }
        if (!address_id || address_id.trim().length === 0) {
            return ['Address id is required', undefined];
        }
        
        // Validar campos numéricos opcionales
        if (bedrooms !== undefined && bedrooms !== null) {
            const bedroomsNum = Number(bedrooms);
            if (isNaN(bedroomsNum) || bedroomsNum < 0) {
                return ['Bedrooms must be a non-negative number', undefined];
            }
        }
        
        if (bathrooms !== undefined && bathrooms !== null) {
            const bathroomsNum = Number(bathrooms);
            if (isNaN(bathroomsNum) || bathroomsNum < 0) {
                return ['Bathrooms must be a non-negative number', undefined];
            }
        }

        // Validar longitud de título
        if (title.trim().length < 3) {
            return ['Title must be at least 3 characters', undefined];
        }
        if (title.trim().length > 200) {
            return ['Title must be less than 200 characters', undefined];
        }

        return [
            undefined, 
            new CreatePropertyDto(
                title.trim(),
                Number(price),
                owner_id.trim(),
                address_id.trim(),
                description?.trim() || undefined,
                bedrooms !== undefined && bedrooms !== null ? Number(bedrooms) : undefined,
                bathrooms !== undefined && bathrooms !== null ? Number(bathrooms) : undefined,
                client_id?.trim() || undefined,
                status_id?.trim() || undefined,
                property_type_id?.trim() || undefined,
                operation_type_id?.trim() || undefined
            )
        ];
    }
}

