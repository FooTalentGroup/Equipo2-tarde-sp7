import { regularExps } from "../../../config";

export class CreateClientDto {
    constructor(
        public readonly first_name: string,
        public readonly last_name: string,
        public readonly email?: string,
        public readonly phone?: string,
        public readonly dni?: string,
    ){}

    static create( object: { [key: string]: any }): [string?, CreateClientDto?] {
        const { first_name, last_name, email, phone, dni } = object;
        
        // Validar campos requeridos
        if (!first_name || first_name.trim().length === 0) {
            return ['First name is required', undefined];
        }
        if (!last_name || last_name.trim().length === 0) {
            return ['Last name is required', undefined];
        }
        
        // Validar formato de email si se proporciona
        if (email && email.trim().length > 0) {
            if (!regularExps.email.test(email.trim())) {
                return ['Email format is invalid', undefined];
            }
        }
        
        // Validar formato de phone si se proporciona
        if (phone && phone.trim().length > 0) {
            if (!regularExps.phone.test(phone.trim())) {
                return ['Phone format is invalid', undefined];
            }
        }

        // Validar longitud de nombres
        if (first_name.trim().length < 2) {
            return ['First name must be at least 2 characters', undefined];
        }
        if (last_name.trim().length < 2) {
            return ['Last name must be at least 2 characters', undefined];
        }

        return [
            undefined, 
            new CreateClientDto(
                first_name.trim(),
                last_name.trim(),
                email?.trim().toLowerCase() || undefined,
                phone?.trim() || undefined,
                dni?.trim() || undefined
            )
        ];
    }
}

