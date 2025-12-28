
export class CreatePropertyPriceDto {
    constructor(
        public readonly price: number,
        public readonly currency_type_id?: number,
        public readonly currency_symbol?: string,
        public readonly operation_type_id?: number,
        public readonly operation_type?: string,
    ) {}

    static create(object: Record<string, unknown>): [string?, CreatePropertyPriceDto?] {
        const { 
            price, 
            currency_type_id, 
            currency, 
            currency_symbol,
            operation_type_id, 
            operation_type 
        } = object;

        if (price === undefined || price === null) {
            return ['Price is required', undefined];
        }
        if (isNaN(Number(price)) || Number(price) <= 0) {
            return ['Price must be a positive number', undefined];
        }

        const hasCurrencyId = currency_type_id !== undefined && currency_type_id !== null;
        const hasCurrencySymbol = (currency_symbol || currency) !== undefined && (currency_symbol || currency) !== null;
        
        if (!hasCurrencyId && !hasCurrencySymbol) {
            return ['Currency type ID or currency symbol (ARS, USD, EUR) is required', undefined];
        }

        if (hasCurrencyId && hasCurrencySymbol) {
            return ['Provide either currency_type_id OR currency symbol, not both', undefined];
        }

        if (hasCurrencyId && (isNaN(Number(currency_type_id)) || Number(currency_type_id) <= 0)) {
            return ['Currency type ID must be a positive number', undefined];
        }

        if (hasCurrencySymbol && typeof (currency_symbol || currency) !== 'string') {
            return ['Currency symbol must be a string (e.g., "ARS", "USD", "EUR")', undefined];
        }

        const hasOperationId = operation_type_id !== undefined && operation_type_id !== null;
        const hasOperationName = operation_type !== undefined && operation_type !== null;
        
        if (!hasOperationId && !hasOperationName) {
            return ['Operation type ID or operation type name (Venta, Alquiler, etc.) is required', undefined];
        }

        if (hasOperationId && hasOperationName) {
            return ['Provide either operation_type_id OR operation_type name, not both', undefined];
        }

        if (hasOperationId && (isNaN(Number(operation_type_id)) || Number(operation_type_id) <= 0)) {
            return ['Operation type ID must be a positive number', undefined];
        }

        if (hasOperationName && typeof operation_type !== 'string') {
            return ['Operation type must be a string (e.g., "Venta", "Alquiler")', undefined];
        }

        return [
            undefined,
            new CreatePropertyPriceDto(
                Number(price),
                hasCurrencyId ? Number(currency_type_id) : undefined,
                hasCurrencySymbol ? ((currency_symbol || currency) as string) : undefined,
                hasOperationId ? Number(operation_type_id) : undefined,
                hasOperationName ? (operation_type as string) : undefined,
            )
        ];
    }
}

