export class CreateAddressDto {
    constructor(
        public readonly street: string,
        public readonly id_department: string,
        public readonly number?: string,
    ){}

    static create( object: { [key: string]: any }): [string?, CreateAddressDto?] {
        const { street, number, id_department } = object;
        
        // Validar campos requeridos
        if (!street || street.trim().length === 0) {
            return ['Street is required', undefined];
        }
        if (!id_department || id_department.trim().length === 0) {
            return ['Department id is required', undefined];
        }
        
        // Validar longitud de street
        if (street.trim().length < 3) {
            return ['Street must be at least 3 characters', undefined];
        }

        return [
            undefined, 
            new CreateAddressDto(
                street.trim(),
                id_department.trim(),
                number?.trim() || undefined
            )
        ];
    }
}

