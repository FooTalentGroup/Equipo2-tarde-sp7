import { regularExps } from "../../../config";

export class CreateProfileDto {
    constructor(
        public readonly first_name: string,
        public readonly last_name: string,
        public readonly email: string,
        public readonly password: string,
        public readonly phone?: string,
        public readonly role_id?: string,
        public readonly whatsapp_number?: string,
    ){}

    static create( object: { [key: string]: any }): [string?, CreateProfileDto?] {
        const { first_name, last_name, email, password, phone, role_id, whatsapp_number } = object;
        
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
        
        if (!regularExps.email.test(email.trim())) {
            return ['Email format is invalid', undefined];
        }
        
        if (password.length < 6) {
            return ['Password must be at least 6 characters', undefined];
        }
        if (password.length > 100) {
            return ['Password must be less than 100 characters', undefined];
        }
        
        if (phone && phone.trim().length > 0) {
            if (!regularExps.phone.test(phone.trim())) {
                return ['Phone format is invalid', undefined];
            }
        }
        
        if (whatsapp_number && whatsapp_number.trim().length > 0) {
            if (!regularExps.whatsapp.test(whatsapp_number.trim())) {
                return ['WhatsApp number format is invalid', undefined];
            }
        }

        if (first_name.trim().length < 2) {
            return ['First name must be at least 2 characters', undefined];
        }
        if (last_name.trim().length < 2) {
            return ['Last name must be at least 2 characters', undefined];
        }

        return [
            undefined, 
            new CreateProfileDto(
                first_name.trim(),
                last_name.trim(),
                email.trim().toLowerCase(),
                password,
                phone?.trim() || undefined,
                role_id || undefined,
                whatsapp_number?.trim() || undefined
            )
        ];
    }
}

