import { CustomError } from "../errors/custom.error";

export class ContractEntity {
    constructor(
        public id: string,
        public contract_url: string,
        public property_id?: string,
        public client_id?: string,
        public description?: string,
        public created_at?: Date,
    ) {}

    static fromObject(object: { [key: string]: any }): ContractEntity {
        const { 
            id, 
            property_id,
            client_id,
            contract_url,
            description,
            created_at
        } = object;
        
        if (!id) throw CustomError.badRequest('Id is required');
        if (!contract_url || contract_url.trim().length === 0) {
            throw CustomError.badRequest('Contract URL is required');
        }
        
        // Validate URL format
        if (!this.isValidUrl(contract_url.trim())) {
            throw CustomError.badRequest('Contract URL format is invalid');
        }
        
        // Validate date if it exists
        let createdAt: Date | undefined;
        
        if (created_at) {
            createdAt = created_at instanceof Date ? created_at : new Date(created_at);
            if (isNaN(createdAt.getTime())) {
                throw CustomError.badRequest('Invalid created_at date');
            }
        }

        return new ContractEntity(
            id,
            contract_url.trim(),
            property_id || undefined,
            client_id || undefined,
            description?.trim() || undefined,
            createdAt
        );
    }

    private static isValidUrl(url: string): boolean {
        try {
            new URL(url);
            return true;
        } catch {
            // Also accept relative paths
            return url.startsWith('/') || url.startsWith('./') || url.startsWith('../');
        }
    }
}

