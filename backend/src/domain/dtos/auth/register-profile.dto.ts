import { regularExps } from "../../../config";

export class RegisterProfileDto {
    constructor(
        public readonly first_name: string,
        public readonly last_name: string,
        public readonly email: string,
        public readonly password: string,
        public readonly phone?: string,
        public readonly role_id?: string,
        public readonly whatsapp_number?: string,
    ){}

    static create( object: { [key: string]: any }): [string?, RegisterProfileDto?] {
        const { first_name, last_name, email, password, phone, role_id, whatsapp_number } = object;
        
        // Validar campos requeridos
        if (!first_name || first_name.trim().length === 0) {
            return ['First name is required', undefined];
        }
        if (!last_name || last_name.trim().length === 0) {
            return ['Last name is required', undefined];
        }
        if (!email || email.trim().length === 0) {
            return ['Email is required', undefined];
        }
        if (!password || password.trim().length === 0) {
            return ['Password is required', undefined];
        }
        
        // Validar formato de email
        if (!regularExps.email.test(email.trim())) {
            return ['Email format is invalid', undefined];
        }
        
        // Validar longitud de password
        if (password.length < 6) {
            return ['Password must be at least 6 characters', undefined];
        }
        if (password.length > 100) {
            return ['Password must be less than 100 characters', undefined];
        }
        
        // Validar formato de phone si se proporciona
        if (phone && phone.trim().length > 0) {
            if (!regularExps.phone.test(phone.trim())) {
                return ['Phone format is invalid', undefined];
            }
        }
        
        // Validar formato de whatsapp_number si se proporciona
        if (whatsapp_number && whatsapp_number.trim().length > 0) {
            if (!regularExps.whatsapp.test(whatsapp_number.trim())) {
                return ['WhatsApp number format is invalid', undefined];
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
            new RegisterProfileDto(
                first_name.trim(),
                last_name.trim(),
                email.trim().toLowerCase(),
                password, // No trimear password por seguridad
                phone?.trim() || undefined,
                role_id || undefined,
                whatsapp_number?.trim() || undefined
            )
        ];
    }
}

