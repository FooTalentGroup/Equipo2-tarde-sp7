/**
 * DTO para actualizar un cliente
 * Todos los campos son opcionales
 */
export class UpdateClientDto {
    constructor(
        public readonly first_name?: string,
        public readonly last_name?: string,
        public readonly phone?: string,
        public readonly contact_category_id?: number,
        public readonly contact_category?: string,
        public readonly email?: string,
        public readonly dni?: string,
        public readonly property_interest_phone?: string,
        public readonly address?: string,
        public readonly notes?: string,
        public readonly interest_zone?: string,
        public readonly purchase_interest?: boolean,
        public readonly rental_interest?: boolean,
        public readonly property_search_type_id?: number,
        public readonly property_search_type?: string,
        public readonly city_id?: number,
    ) {}

    static create(object: { [key: string]: any }): [string?, UpdateClientDto?] {
        const {
            first_name,
            last_name,
            phone,
            contact_category_id,
            contact_category,
            email,
            dni,
            property_interest_phone,
            address,
            notes,
            interest_zone,
            purchase_interest,
            rental_interest,
            property_search_type_id,
            property_search_type,
            city_id
        } = object;

        // Validar contact_category si se proporciona
        if (contact_category_id && contact_category) {
            return ['Provide either contact_category_id OR contact_category name, not both', undefined];
        }

        if (contact_category_id && isNaN(Number(contact_category_id))) {
            return ['Contact category ID must be a number', undefined];
        }

        // Validar property_search_type si se proporciona
        if (property_search_type_id && property_search_type) {
            return ['Provide either property_search_type_id OR property_search_type name, not both', undefined];
        }

        if (property_search_type_id && isNaN(Number(property_search_type_id))) {
            return ['Property search type ID must be a number', undefined];
        }

        if (city_id && isNaN(Number(city_id))) {
            return ['City ID must be a number', undefined];
        }

        // Validar que al menos un campo esté presente
        const hasAnyField = first_name || last_name || phone || contact_category_id || contact_category ||
            email !== undefined || dni !== undefined || property_interest_phone !== undefined ||
            address !== undefined || notes !== undefined || interest_zone !== undefined ||
            purchase_interest !== undefined || rental_interest !== undefined ||
            property_search_type_id || property_search_type || city_id;

        if (!hasAnyField) {
            return ['At least one field must be provided for update', undefined];
        }

        return [
            undefined,
            new UpdateClientDto(
                first_name?.trim(),
                last_name?.trim(),
                phone?.trim(),
                contact_category_id ? Number(contact_category_id) : undefined,
                contact_category?.trim(),
                email?.trim(),
                dni?.trim(),
                property_interest_phone?.trim(),
                address?.trim(),
                notes?.trim(),
                interest_zone?.trim(),
                purchase_interest !== undefined ? Boolean(purchase_interest) : undefined,
                rental_interest !== undefined ? Boolean(rental_interest) : undefined,
                property_search_type_id ? Number(property_search_type_id) : undefined,
                property_search_type?.trim(),
                city_id ? Number(city_id) : undefined
            )
        ];
    }
}




