import { CustomError } from "../errors/custom.error";

export class AddressEntity {
    constructor(
        public id: string,
        public street: string,
        public id_department: string,
        public number?: string,
        public created_at?: Date,
        public updated_at?: Date,
    ) {}

    static fromObject(object: { [key: string]: any }): AddressEntity {
        const { 
            id, 
            street, 
            number,
            id_department,
            created_at, 
            updated_at 
        } = object;
        
        if (!id) throw CustomError.badRequest('Id is required');
        if (!street || street.trim().length === 0) {
            throw CustomError.badRequest('Street is required');
        }
        if (!id_department) {
            throw CustomError.badRequest('Department id is required');
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

        return new AddressEntity(
            id,
            street.trim(),
            id_department,
            number?.trim() || undefined,
            createdAt,
            updatedAt
        );
    }

    get fullAddress(): string {
        return `${this.street}${this.number ? ` ${this.number}` : ''}`.trim();
    }
}

