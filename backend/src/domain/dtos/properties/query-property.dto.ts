export class QueryPropertyDto {
    constructor(
        public readonly owner_id?: string,
        public readonly status_id?: string,
        public readonly property_type_id?: string,
        public readonly operation_type_id?: string,
        public readonly client_id?: string,
        public readonly min_price?: number,
        public readonly max_price?: number,
        public readonly min_bedrooms?: number,
        public readonly min_bathrooms?: number,
        public readonly limit?: number,
        public readonly offset?: number,
    ){}

    static create( object: { [key: string]: any }): [string?, QueryPropertyDto?] {
        const { 
            owner_id,
            status_id,
            property_type_id,
            operation_type_id,
            client_id,
            min_price,
            max_price,
            min_bedrooms,
            min_bathrooms,
            limit,
            offset
        } = object;
        
        // Validar precios si se proporcionan
        if (min_price !== undefined && min_price !== null) {
            const minPriceNum = Number(min_price);
            if (isNaN(minPriceNum) || minPriceNum < 0) {
                return ['Min price must be a non-negative number', undefined];
            }
        }
        
        if (max_price !== undefined && max_price !== null) {
            const maxPriceNum = Number(max_price);
            if (isNaN(maxPriceNum) || maxPriceNum < 0) {
                return ['Max price must be a non-negative number', undefined];
            }
        }
        
        // Validar que min_price no sea mayor que max_price
        if (min_price !== undefined && max_price !== undefined) {
            if (Number(min_price) > Number(max_price)) {
                return ['Min price cannot be greater than max price', undefined];
            }
        }
        
        // Validar bedrooms y bathrooms
        if (min_bedrooms !== undefined && min_bedrooms !== null) {
            const minBedroomsNum = Number(min_bedrooms);
            if (isNaN(minBedroomsNum) || minBedroomsNum < 0) {
                return ['Min bedrooms must be a non-negative number', undefined];
            }
        }
        
        if (min_bathrooms !== undefined && min_bathrooms !== null) {
            const minBathroomsNum = Number(min_bathrooms);
            if (isNaN(minBathroomsNum) || minBathroomsNum < 0) {
                return ['Min bathrooms must be a non-negative number', undefined];
            }
        }
        
        // Validar paginación
        if (limit !== undefined && limit !== null) {
            const limitNum = Number(limit);
            if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
                return ['Limit must be between 1 and 100', undefined];
            }
        }
        
        if (offset !== undefined && offset !== null) {
            const offsetNum = Number(offset);
            if (isNaN(offsetNum) || offsetNum < 0) {
                return ['Offset must be a non-negative number', undefined];
            }
        }

        return [
            undefined, 
            new QueryPropertyDto(
                owner_id?.trim() || undefined,
                status_id?.trim() || undefined,
                property_type_id?.trim() || undefined,
                operation_type_id?.trim() || undefined,
                client_id?.trim() || undefined,
                min_price !== undefined && min_price !== null ? Number(min_price) : undefined,
                max_price !== undefined && max_price !== null ? Number(max_price) : undefined,
                min_bedrooms !== undefined && min_bedrooms !== null ? Number(min_bedrooms) : undefined,
                min_bathrooms !== undefined && min_bathrooms !== null ? Number(min_bathrooms) : undefined,
                limit !== undefined && limit !== null ? Number(limit) : undefined,
                offset !== undefined && offset !== null ? Number(offset) : undefined
            )
        ];
    }
}

