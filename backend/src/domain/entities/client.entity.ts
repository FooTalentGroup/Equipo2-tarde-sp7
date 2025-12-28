import { CustomError } from '../errors/custom.error';
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

    static fromDatabaseObject(object: { [key: string]: any }): ClientEntity {
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

        let registeredDate: Date | undefined = undefined;
        if (registered_at) {
            registeredDate = registered_at instanceof Date 
                ? registered_at 
                : new Date(registered_at);
            if (isNaN(registeredDate.getTime())) {
                registeredDate = undefined;
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

    static fromObject(object: { [key: string]: any }): ClientEntity {
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

        if (!id) {
            throw CustomError.badRequest('Client ID is required');
        }

        if (!first_name || first_name.trim().length === 0) {
            throw CustomError.badRequest('First name is required');
        }

        if (first_name.trim().length < 2) {
            throw CustomError.badRequest('First name must be at least 2 characters');
        }

        if (first_name.trim().length > 100) {
            throw CustomError.badRequest('First name must be less than 100 characters');
        }

        if (!last_name || last_name.trim().length === 0) {
            throw CustomError.badRequest('Last name is required');
        }

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

        if (email && email.trim().length > 0) {
            if (!ClientEntity.isValidEmail(email)) {
                throw CustomError.badRequest('Invalid email format');
            }
        }

        if (!ClientEntity.isValidPhone(phone)) {
            throw CustomError.badRequest('Invalid phone format');
        }
        if (property_interest_phone && property_interest_phone.trim().length > 0) {
            if (!ClientEntity.isValidPhone(property_interest_phone)) {
                throw CustomError.badRequest('Invalid property interest phone format');
            }
        }

        if (dni && dni.trim().length > 0) {
            if (!ClientEntity.isValidDni(dni)) {
                throw CustomError.badRequest('Invalid DNI format');
            }
        }

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

  
    get fullName(): string {
        return `${this.first_name} ${this.last_name}`.trim();
    }

    get primaryPhone(): string {
        return this.property_interest_phone || this.phone;
    }

    hasInterest(): boolean {
        return this.purchase_interest === true || this.rental_interest === true;
    }

    canBeDeleted(): boolean {
        return !this.deleted;
    }

 
    canBeUpdated(): boolean {
        return !this.deleted;
    }

   
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

    private static isValidEmail(email: string): boolean {
        const trimmedEmail = email.trim();
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(trimmedEmail) && trimmedEmail.length <= 255;
    }

    private static isValidPhone(phone: string): boolean {
        const trimmedPhone = phone.trim();
        
        const validCharsRegex = /^[\d\s\-\(\)\+\.]+$/;
        if (!validCharsRegex.test(trimmedPhone)) {
            return false;
        }
        
        const digitsOnly = trimmedPhone.replace(/\D/g, '');
        
        if (digitsOnly.length < 10) {
            return false;
        }
        
        if (digitsOnly.length > 15) {
            return false;
        }
        
        return true;
    }

    private static isValidDni(dni: string): boolean {
        const dniRegex = /^[\d\s\-]{7,}$/;
        const digitsOnly = dni.replace(/\D/g, '');
        return dniRegex.test(dni) && digitsOnly.length >= 7 && digitsOnly.length <= 15;
    }
}


