import { CustomError } from "../errors/custom.error";

export class ClientEntity {
    constructor(
        public id: string,
        public first_name: string,
        public last_name: string,
        public email?: string,
        public phone?: string,
        public dni?: string,
        public created_at?: Date,
        public updated_at?: Date,
    ) {}

    static fromObject(object: { [key: string]: any }): ClientEntity {
        const { 
            id, 
            first_name, 
            last_name, 
            email, 
            phone,
            dni,
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
        
        // Validate email format if provided
        if (email && email.trim().length > 0) {
            if (!this.isValidEmail(email.trim())) {
                throw CustomError.badRequest('Email format is invalid');
            }
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

        return new ClientEntity(
            id,
            first_name.trim(),
            last_name.trim(),
            email?.trim() || undefined,
            phone?.trim() || undefined,
            dni?.trim() || undefined,
            createdAt,
            updatedAt
        );
    }

    get fullName(): string {
        return `${this.first_name} ${this.last_name}`.trim();
    }

    private static isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

