import { CustomError } from "../errors/custom.error";

export class ProfileEntity {

    constructor(
        public id: string,
        public first_name: string,
        public last_name: string,
        public email: string,
        public password: string,
        public phone?: string,
        public role_id?: string,
        public whatsapp_number?: string,
        public created_at?: Date,
        public updated_at?: Date,
    ) {}

    static fromObject(object: { [key: string]: any }): ProfileEntity {
        const { 
            id, 
            first_name, 
            last_name, 
            email, 
            password,
            phone, 
            role_id, 
            whatsapp_number,
            created_at, 
            updated_at 
        } = object;
        
        if (!id) throw CustomError.badRequest('Id is required');
        if (!first_name || first_name.trim().length === 0) {
            throw CustomError.badRequest('First name is required');
        }
        if (!last_name || last_name.trim().length === 0) {
            throw CustomError.badRequest('Last name is required');
        }
        if (!email || email.trim().length === 0) {
            throw CustomError.badRequest('Email is required');
        }
        if (!this.isValidEmail(email)) {
            throw CustomError.badRequest('Email format is invalid');
        }
        if (!password || password.trim().length === 0) {
            throw CustomError.badRequest('Password is required');
        }
        
        // Validate dates if they exist
        let createdAt: Date | undefined;
        let updatedAt: Date | undefined;
        
        if (created_at) {
            createdAt = created_at instanceof Date ? created_at : new Date(created_at);
            if (isNaN(createdAt.getTime())) {
                throw CustomError.badRequest('Invalid created_at date');
            }
        }
        
        if (updated_at) {
            updatedAt = updated_at instanceof Date ? updated_at : new Date(updated_at);
            if (isNaN(updatedAt.getTime())) {
                throw CustomError.badRequest('Invalid updated_at date');
            }
        }

        return new ProfileEntity(
            id,
            first_name.trim(),
            last_name.trim(),
            email.trim().toLowerCase(),
            password, // Password is already hashed from database
            phone?.trim() || undefined,
            role_id || undefined,
            whatsapp_number?.trim() || undefined,
            createdAt,
            updatedAt
        );
    }

    get fullName(): string {
        return `${this.first_name} ${this.last_name}`.trim();
    }

    // Return public object without password
    toPublicObject() {
        const { password: _, ...publicProfile } = this;
        return publicProfile as Omit<ProfileEntity, 'password'>;
    }

    private static isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}


