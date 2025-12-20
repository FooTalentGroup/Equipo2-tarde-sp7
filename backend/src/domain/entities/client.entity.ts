import { CustomError } from '../errors/custom.error';

/**
 * Domain Entity for Client
 * Contains business logic and validations
 */
export class ClientEntity {
    constructor(
        public id: number,
        public first_name: string,
        public last_name: string,
        public phone: string,
        public contact_category_id: number,
        public email?: string,
        public dni?: string,
        public property_interest_phone?: string,
        public address?: string,
        public notes?: string,
        public interest_zone?: string,
        public purchase_interest?: boolean,
        public rental_interest?: boolean,
        public property_search_type_id?: number,
        public city_id?: number,
        public registered_at?: Date,
        public deleted?: boolean,
    ) {}

    /**
     * Creates a ClientEntity from database object WITHOUT format validation
     * Use this when reading from database (data already validated on creation)
     */
    static fromDatabaseObject(object: Record<string, unknown>): ClientEntity {
        const {
            id,
            first_name,
            last_name,
            phone,
            contact_category_id,
            email,
            dni,
            property_interest_phone,
            address,
            notes,
            interest_zone,
            purchase_interest,
            rental_interest,
            property_search_type_id,
            city_id,
            registered_at,
            deleted,
        } = object;

        // Only validate that required fields exist (not their format)
        // Format validation was done when the data was created/updated
        if (!id) {
            throw CustomError.badRequest('Client ID is required');
        }

        if (!first_name) {
            throw CustomError.badRequest('First name is required');
        }

        if (!last_name) {
            throw CustomError.badRequest('Last name is required');
        }

        if (!phone) {
            throw CustomError.badRequest('Phone is required');
        }

        if (!contact_category_id) {
            throw CustomError.badRequest('Contact category ID is required');
        }

        // Parse date if provided
        let registeredDate: Date | undefined = undefined;
        if (registered_at) {
            registeredDate = registered_at instanceof Date 
                ? registered_at 
                : new Date(registered_at);
            if (isNaN(registeredDate.getTime())) {
                registeredDate = undefined; // Don't throw, just ignore invalid dates
            }
        }

        return new ClientEntity(
            Number(id),
            String(first_name).trim(),
            String(last_name).trim(),
            String(phone).trim(),
            Number(contact_category_id),
            email ? String(email).trim() : undefined,
            dni ? String(dni).trim() : undefined,
            property_interest_phone ? String(property_interest_phone).trim() : undefined,
            address ? String(address).trim() : undefined,
            notes ? String(notes).trim() : undefined,
            interest_zone ? String(interest_zone).trim() : undefined,
            purchase_interest !== undefined ? Boolean(purchase_interest) : undefined,
            rental_interest !== undefined ? Boolean(rental_interest) : undefined,
            property_search_type_id !== undefined && property_search_type_id !== null 
                ? Number(property_search_type_id) 
                : undefined,
            city_id !== undefined && city_id !== null 
                ? Number(city_id) 
                : undefined,
            registeredDate,
            deleted !== undefined ? Boolean(deleted) : false,
        );
    }

    /**
     * Creates a ClientEntity from an object WITH full validation
     * Use this when creating or updating clients (input validation)
     */
    static fromObject(object: Record<string, unknown>): ClientEntity {
        const {
            id,
            first_name,
            last_name,
            phone,
            contact_category_id,
            email,
            dni,
            property_interest_phone,
            address,
            notes,
            interest_zone,
            purchase_interest,
            rental_interest,
            property_search_type_id,
            city_id,
            registered_at,
            deleted,
        } = object;

        // Validate required fields
        if (!id) {
            throw CustomError.badRequest('Client ID is required');
        }

        if (!first_name || first_name.trim().length === 0) {
            throw CustomError.badRequest('First name is required');
        }

        // Validate first name length
        if (first_name.trim().length < 2) {
            throw CustomError.badRequest('First name must be at least 2 characters');
        }

        if (first_name.trim().length > 100) {
            throw CustomError.badRequest('First name must be less than 100 characters');
        }

        if (!last_name || last_name.trim().length === 0) {
            throw CustomError.badRequest('Last name is required');
        }

        // Validate last name length
        if (last_name.trim().length < 2) {
            throw CustomError.badRequest('Last name must be at least 2 characters');
        }

        if (last_name.trim().length > 100) {
            throw CustomError.badRequest('Last name must be less than 100 characters');
        }

        if (!phone || phone.trim().length === 0) {
            throw CustomError.badRequest('Phone is required');
        }

        if (!contact_category_id) {
            throw CustomError.badRequest('Contact category ID is required');
        }

        // Validate email format if provided
        if (email && email.trim().length > 0) {
            if (!ClientEntity.isValidEmail(email)) {
                throw CustomError.badRequest('Invalid email format');
            }
        }

        // Validate phone format (basic validation)
        if (!ClientEntity.isValidPhone(phone)) {
            throw CustomError.badRequest('Invalid phone format');
        }

        // Validate property_interest_phone if provided
        if (property_interest_phone && property_interest_phone.trim().length > 0) {
            if (!ClientEntity.isValidPhone(property_interest_phone)) {
                throw CustomError.badRequest('Invalid property interest phone format');
            }
        }

        // Validate DNI format if provided (basic validation - numbers and optional dashes)
        if (dni && dni.trim().length > 0) {
            if (!ClientEntity.isValidDni(dni)) {
                throw CustomError.badRequest('Invalid DNI format');
            }
        }

        // Validate dates
        let registeredDate: Date | undefined = undefined;
        if (registered_at) {
            registeredDate = registered_at instanceof Date 
                ? registered_at 
                : new Date(registered_at);
            if (isNaN(registeredDate.getTime())) {
                throw CustomError.badRequest('Invalid registered_at date');
            }
        }

        return new ClientEntity(
            Number(id),
            first_name.trim(),
            last_name.trim(),
            phone.trim(),
            Number(contact_category_id),
            email?.trim() || undefined,
            dni?.trim() || undefined,
            property_interest_phone?.trim() || undefined,
            address?.trim() || undefined,
            notes?.trim() || undefined,
            interest_zone?.trim() || undefined,
            purchase_interest !== undefined ? Boolean(purchase_interest) : undefined,
            rental_interest !== undefined ? Boolean(rental_interest) : undefined,
            property_search_type_id !== undefined && property_search_type_id !== null 
                ? Number(property_search_type_id) 
                : undefined,
            city_id !== undefined && city_id !== null 
                ? Number(city_id) 
                : undefined,
            registeredDate,
            deleted !== undefined ? Boolean(deleted) : false,
        );
    }

    /**
     * Returns full name of the client
     */
    get fullName(): string {
        return `${this.first_name} ${this.last_name}`.trim();
    }

    /**
     * Returns primary contact phone (prefers property_interest_phone if available)
     */
    get primaryPhone(): string {
        return this.property_interest_phone || this.phone;
    }

    /**
     * Checks if client has any interest (purchase or rental)
     */
    hasInterest(): boolean {
        return this.purchase_interest === true || this.rental_interest === true;
    }

    /**
     * Checks if client can be deleted
     * Business rule: Cannot delete if has active properties or rentals
     * For now, returns true but can be extended with actual checks
     */
    canBeDeleted(): boolean {
        // TODO: Add check for active properties
        // TODO: Add check for active rentals
        return !this.deleted;
    }

    /**
     * Checks if client can be updated
     * Business rule: Cannot update if deleted
     */
    canBeUpdated(): boolean {
        return !this.deleted;
    }

    /**
     * Returns public object representation (excludes sensitive/internal data)
     */
    toPublicObject() {
        return {
            id: this.id,
            first_name: this.first_name,
            last_name: this.last_name,
            email: this.email || null,
            dni: this.dni || null,
            phone: this.phone,
            property_interest_phone: this.property_interest_phone || null,
            address: this.address || null,
            notes: this.notes || null,
            contact_category_id: this.contact_category_id,
            interest_zone: this.interest_zone || null,
            purchase_interest: this.purchase_interest ?? false,
            rental_interest: this.rental_interest ?? false,
            property_search_type_id: this.property_search_type_id || null,
            city_id: this.city_id || null,
            registered_at: this.registered_at || null,
        };
    }

    /**
     * Validates email format
     */
    private static isValidEmail(email: string): boolean {
        const trimmedEmail = email.trim();
        // More strict email validation
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(trimmedEmail) && trimmedEmail.length <= 255;
    }

    /**
     * Validates phone format (allows ONLY numbers, spaces, dashes, parentheses, plus sign)
     * NO letters allowed
     */
    private static isValidPhone(phone: string): boolean {
        const trimmedPhone = phone.trim();
        
        // Must contain only valid characters: digits, spaces, dashes, parentheses, plus sign, dots
        // NO letters allowed
        const validCharsRegex = /^[\d\s\-\(\)\+\.]+$/;
        if (!validCharsRegex.test(trimmedPhone)) {
            return false;
        }
        
        // Extract only digits
        const digitsOnly = trimmedPhone.replace(/\D/g, '');
        
        // Must have at least 10 digits
        if (digitsOnly.length < 10) {
            return false;
        }
        
        // Must have at most 15 digits (international standard)
        if (digitsOnly.length > 15) {
            return false;
        }
        
        return true;
    }

    /**
     * Validates DNI format (allows numbers and optional dashes/spaces)
     */
    private static isValidDni(dni: string): boolean {
        // Basic validation: at least 7 digits, allows dashes and spaces
        const dniRegex = /^[\d\s\-]{7,}$/;
        const digitsOnly = dni.replace(/\D/g, '');
        return dniRegex.test(dni) && digitsOnly.length >= 7 && digitsOnly.length <= 15;
    }
}


