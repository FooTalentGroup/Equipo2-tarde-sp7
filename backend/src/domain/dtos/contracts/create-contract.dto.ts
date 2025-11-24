export class CreateContractDto {
    constructor(
        public readonly contract_url: string,
        public readonly property_id?: string,
        public readonly client_id?: string,
        public readonly description?: string,
    ){}

    static create( object: { [key: string]: any }): [string?, CreateContractDto?] {
        const { property_id, client_id, contract_url, description } = object;
        
        // Validar campo requerido
        if (!contract_url || contract_url.trim().length === 0) {
            return ['Contract URL is required', undefined];
        }
        
        // Validar formato de URL
        if (!this.isValidUrl(contract_url.trim())) {
            return ['Contract URL format is invalid', undefined];
        }

        return [
            undefined, 
            new CreateContractDto(
                contract_url.trim(),
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

