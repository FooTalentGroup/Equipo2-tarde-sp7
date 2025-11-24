export class UpdateAddressDto {
    constructor(
        public readonly street?: string,
        public readonly id_department?: string,
        public readonly number?: string,
    ){}

    static create( object: { [key: string]: any }): [string?, UpdateAddressDto?] {
        const { street, number, id_department } = object;
        
        // Si no hay ningún campo, retornar error
        if (!street && !id_department && !number) {
            return ['At least one field must be provided', undefined];
        }
        
        // Validar street si se proporciona
        if (street !== undefined && street !== null) {
            if (street.trim().length === 0) {
                return ['Street cannot be empty', undefined];
            }
            if (street.trim().length < 3) {
                return ['Street must be at least 3 characters', undefined];
            }
        }

        return [
            undefined, 
            new UpdateAddressDto(
                street?.trim() || undefined,
                id_department?.trim() || undefined,
                number?.trim() || undefined
            )
        ];
    }
}

