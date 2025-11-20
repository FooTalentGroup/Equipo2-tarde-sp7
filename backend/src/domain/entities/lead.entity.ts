import { CustomError } from "../errors/custom.error";

export class LeadEntity {
    constructor(
        public id: string,
        public status_id: string,
        public property_id?: string,
        public profile_id?: string,
        public origin?: string,
        public visitor_name?: string,
        public visitor_phone?: string,
        public visitor_email?: string,
        public message?: string,
        public created_at?: Date,
    ) {}

    static fromObject(object: { [key: string]: any }): LeadEntity {
        const { 
            id, 
            property_id,
            profile_id,
            origin,
            status_id,
            visitor_name,
            visitor_phone,
            visitor_email,
            message,
            created_at
        } = object;
        
        if (!id) throw CustomError.badRequest('Id is required');
        if (!status_id) {
            throw CustomError.badRequest('Status id is required');
        }
        
        // Validate email format if provided
        if (visitor_email && visitor_email.trim().length > 0) {
            if (!this.isValidEmail(visitor_email.trim())) {
                throw CustomError.badRequest('Visitor email format is invalid');
            }
        }
        
        // Validate date if it exists
        let createdAt: Date | undefined;
        
        if (created_at) {
            createdAt = created_at instanceof Date ? created_at : new Date(created_at);
            if (isNaN(createdAt.getTime())) {
                throw CustomError.badRequest('Invalid created_at date');
            }
        }

        return new LeadEntity(
            id,
            status_id,
            property_id || undefined,
            profile_id || undefined,
            origin?.trim() || undefined,
            visitor_name?.trim() || undefined,
            visitor_phone?.trim() || undefined,
            visitor_email?.trim().toLowerCase() || undefined,
            message?.trim() || undefined,
            createdAt
        );
    }

    private static isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

