import { CustomError } from "../errors/custom.error";

export class PropertyEntity {
    constructor(
        public id: string,
        public title: string,
        public price: number,
        public owner_id: string,
        public address_id: string,
        public description?: string,
        public bedrooms?: number,
        public bathrooms?: number,
        public client_id?: string,
        public status_id?: string,
        public property_type_id?: string,
        public operation_type_id?: string,
        public created_at?: Date,
        public updated_at?: Date,
    ) {}

    static fromObject(object: { [key: string]: any }): PropertyEntity {
        const { 
            id, 
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
            operation_type_id,
            created_at, 
            updated_at 
        } = object;
        
        if (!id) throw CustomError.badRequest('Id is required');
        if (!title || title.trim().length === 0) {
            throw CustomError.badRequest('Title is required');
        }
        if (price === undefined || price === null) {
            throw CustomError.badRequest('Price is required');
        }
        if (price < 0) {
            throw CustomError.badRequest('Price must be greater than or equal to 0');
        }
        if (!owner_id) {
            throw CustomError.badRequest('Owner id is required');
        }
        if (!address_id) {
            throw CustomError.badRequest('Address id is required');
        }
        
        // Validate numeric fields
        if (bedrooms !== undefined && bedrooms !== null && bedrooms < 0) {
            throw CustomError.badRequest('Bedrooms must be greater than or equal to 0');
        }
        if (bathrooms !== undefined && bathrooms !== null && bathrooms < 0) {
            throw CustomError.badRequest('Bathrooms must be greater than or equal to 0');
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

        return new PropertyEntity(
            id,
            title.trim(),
            Number(price),
            owner_id,
            address_id,
            description?.trim() || undefined,
            bedrooms !== undefined && bedrooms !== null ? Number(bedrooms) : undefined,
            bathrooms !== undefined && bathrooms !== null ? Number(bathrooms) : undefined,
            client_id || undefined,
            status_id || undefined,
            property_type_id || undefined,
            operation_type_id || undefined,
            createdAt,
            updatedAt
        );
    }
}

