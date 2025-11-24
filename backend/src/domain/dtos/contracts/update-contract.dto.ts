export class UpdateContractDto {
    constructor(
        public readonly contract_url?: string,
        public readonly property_id?: string,
        public readonly client_id?: string,
        public readonly description?: string,
    ){}

    static create( object: { [key: string]: any }): [string?, UpdateContractDto?] {
        const { property_id, client_id, contract_url, description } = object;
        
        // Si no hay ningún campo, retornar error
        if (!contract_url && !property_id && !client_id && !description) {
            return ['At least one field must be provided', undefined];
        }
        
        // Validar formato de URL si se proporciona
        if (contract_url !== undefined && contract_url !== null) {
            if (contract_url.trim().length === 0) {
                return ['Contract URL cannot be empty', undefined];
            }
            if (!this.isValidUrl(contract_url.trim())) {
                return ['Contract URL format is invalid', undefined];
            }
        }

        return [
            undefined, 
            new UpdateContractDto(
                contract_url?.trim() || undefined,
                property_id?.trim() || undefined,
                client_id?.trim() || undefined,
                description?.trim() || undefined
            )
        ];
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

