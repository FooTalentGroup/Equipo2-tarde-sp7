export class UpdatePropertyDto {
    constructor(
        public readonly title?: string,
        public readonly description?: string,
        public readonly price?: number,
        public readonly bedrooms?: number,
        public readonly bathrooms?: number,
        public readonly owner_id?: string,
        public readonly client_id?: string,
        public readonly address_id?: string,
        public readonly status_id?: string,
        public readonly property_type_id?: string,
        public readonly operation_type_id?: string,
    ){}

    static create( object: { [key: string]: any }): [string?, UpdatePropertyDto?] {
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
        
        // Si no hay ningún campo, retornar error
        if (!title && !description && price === undefined && bedrooms === undefined && 
            bathrooms === undefined && !owner_id && !client_id && !address_id && 
            !status_id && !property_type_id && !operation_type_id) {
            return ['At least one field must be provided', undefined];
        }
        
        // Validar price si se proporciona
        if (price !== undefined && price !== null) {
            if (typeof price !== 'number' && isNaN(Number(price))) {
                return ['Price must be a valid number', undefined];
            }
            if (Number(price) < 0) {
                return ['Price must be greater than or equal to 0', undefined];
            }
        }
        
        // Validar bedrooms si se proporciona
        if (bedrooms !== undefined && bedrooms !== null) {
            const bedroomsNum = Number(bedrooms);
            if (isNaN(bedroomsNum) || bedroomsNum < 0) {
                return ['Bedrooms must be a non-negative number', undefined];
            }
        }
        
        // Validar bathrooms si se proporciona
        if (bathrooms !== undefined && bathrooms !== null) {
            const bathroomsNum = Number(bathrooms);
            if (isNaN(bathroomsNum) || bathroomsNum < 0) {
                return ['Bathrooms must be a non-negative number', undefined];
            }
        }

        // Validar título si se proporciona
        if (title !== undefined && title !== null) {
            if (title.trim().length === 0) {
                return ['Title cannot be empty', undefined];
            }
            if (title.trim().length < 3) {
                return ['Title must be at least 3 characters', undefined];
            }
            if (title.trim().length > 200) {
                return ['Title must be less than 200 characters', undefined];
            }
        }

        return [
            undefined, 
            new UpdatePropertyDto(
                title?.trim() || undefined,
                description?.trim() || undefined,
                price !== undefined && price !== null ? Number(price) : undefined,
                bedrooms !== undefined && bedrooms !== null ? Number(bedrooms) : undefined,
                bathrooms !== undefined && bathrooms !== null ? Number(bathrooms) : undefined,
                owner_id?.trim() || undefined,
                client_id?.trim() || undefined,
                address_id?.trim() || undefined,
                status_id?.trim() || undefined,
                property_type_id?.trim() || undefined,
                operation_type_id?.trim() || undefined
            )
        ];
    }
}

