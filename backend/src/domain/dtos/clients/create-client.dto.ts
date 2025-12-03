/**
 * DTO para crear un cliente
 * Acepta nombres o IDs para catálogos (contact_category, property_search_type)
 */
export class CreateClientDto {
    constructor(
        // Datos básicos (requeridos)
        public readonly first_name: string,
        public readonly last_name: string,
        public readonly phone: string,
        
        // Acepta ID o nombre para contact_category
        public readonly contact_category_id: number | undefined,
        public readonly contact_category: string | undefined,
        
        // Datos opcionales
        public readonly email?: string,
        public readonly dni?: string,
        public readonly property_interest_phone?: string,
        public readonly address?: string,
        public readonly notes?: string,
        public readonly interest_zone?: string,
        public readonly purchase_interest?: boolean,
        public readonly rental_interest?: boolean,
        
        // Acepta ID o nombre para property_search_type
        public readonly property_search_type_id?: number,
        public readonly property_search_type?: string,
        
        // Geografía
        public readonly city_id?: number,
        public readonly city?: string,
        public readonly province?: string,
        public readonly country?: string,
    ) {}

    static create(object: { [key: string]: any }): [string?, CreateClientDto?] {
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
            city_id,
            city,
            province,
            country
        } = object;

        // Validar campos requeridos
        if (!first_name || first_name.trim().length === 0) {
            return ['First name is required', undefined];
        }
        if (!last_name || last_name.trim().length === 0) {
            return ['Last name is required', undefined];
        }
        if (!phone || phone.trim().length === 0) {
            return ['Phone is required', undefined];
        }

        // Validar contact_category: debe tener ID o nombre
        const hasContactCategoryId = contact_category_id !== undefined && contact_category_id !== null;
        const hasContactCategoryName = contact_category !== undefined && contact_category !== null;
        
        if (!hasContactCategoryId && !hasContactCategoryName) {
            return ['Contact category ID or name is required (e.g., "Lead", "Inquilino", "Propietario")', undefined];
        }

        if (hasContactCategoryId && hasContactCategoryName) {
            return ['Provide either contact_category_id OR contact_category name, not both', undefined];
        }

        if (hasContactCategoryId && isNaN(Number(contact_category_id))) {
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

        return [
            undefined,
            new CreateClientDto(
                first_name.trim(),
                last_name.trim(),
                phone.trim(),
                hasContactCategoryId ? Number(contact_category_id) : undefined,
                hasContactCategoryName ? contact_category.trim() : undefined,
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
                city_id ? Number(city_id) : undefined,
                city?.trim(),
                province?.trim(),
                country?.trim()
            )
        ];
    }
}




