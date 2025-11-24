import { regularExps } from "../../../config";

export class UpdateClientDto {
    constructor(
        public readonly first_name?: string,
        public readonly last_name?: string,
        public readonly email?: string,
        public readonly phone?: string,
        public readonly dni?: string,
    ){}

    static create( object: { [key: string]: any }): [string?, UpdateClientDto?] {
        const { first_name, last_name, email, phone, dni } = object;
        
        // Si no hay ningún campo, retornar error
        if (!first_name && !last_name && !email && !phone && !dni) {
            return ['At least one field must be provided', undefined];
        }
        
        // Validar formato de email si se proporciona
        if (email !== undefined && email !== null) {
            if (email.trim().length === 0) {
                return ['Email cannot be empty', undefined];
            }
            if (!regularExps.email.test(email.trim())) {
                return ['Email format is invalid', undefined];
            }
        }
        
        // Validar formato de phone si se proporciona
        if (phone !== undefined && phone !== null) {
            if (phone.trim().length > 0 && !regularExps.phone.test(phone.trim())) {
                return ['Phone format is invalid', undefined];
            }
        }

        // Validar longitud de nombres si se proporcionan
        if (first_name !== undefined && first_name !== null) {
            if (first_name.trim().length === 0) {
                return ['First name cannot be empty', undefined];
            }
            if (first_name.trim().length < 2) {
                return ['First name must be at least 2 characters', undefined];
            }
        }

        if (last_name !== undefined && last_name !== null) {
            if (last_name.trim().length === 0) {
                return ['Last name cannot be empty', undefined];
            }
            if (last_name.trim().length < 2) {
                return ['Last name must be at least 2 characters', undefined];
            }
        }

        return [
            undefined, 
            new UpdateClientDto(
                first_name?.trim() || undefined,
                last_name?.trim() || undefined,
                email?.trim().toLowerCase() || undefined,
                phone?.trim() || undefined,
                dni?.trim() || undefined
            )
        ];
    }
}

