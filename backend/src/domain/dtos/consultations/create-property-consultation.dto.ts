import { normalizePhone } from '../../utils/phone-normalization.util';

export class CreatePropertyConsultationDto {
    private constructor(
        public readonly property_id: number,
        public readonly first_name: string,
        public readonly last_name: string,
        public readonly phone: string,
        public readonly message: string,
        public readonly email?: string,
    ) {}

    static create(object: { [key: string]: any }): [string?, CreatePropertyConsultationDto?] {
        const { property_id, first_name, last_name, phone, email, message } = object;

        // Validar property_id
        if (!property_id && property_id !== 0) return ['Property ID is required'];
        
        let propertyIdNumber: number;
        if (typeof property_id === 'number') {
            propertyIdNumber = property_id;
        } else if (typeof property_id === 'string') {
            propertyIdNumber = parseInt(property_id, 10);
            if (isNaN(propertyIdNumber)) {
                return ['Property ID must be a valid number'];
            }
        } else {
            return ['Property ID must be a number'];
        }
        
        if (propertyIdNumber <= 0) return ['Property ID must be greater than 0'];

        // Validar first_name
        if (!first_name) return ['First name is required'];
        if (typeof first_name !== 'string') return ['First name must be a string'];
        if (first_name.trim().length < 2) return ['First name must be at least 2 characters'];
        if (first_name.trim().length > 100) return ['First name must be less than 100 characters'];

        // Validar last_name
        if (!last_name) return ['Last name is required'];
        if (typeof last_name !== 'string') return ['Last name must be a string'];
        if (last_name.trim().length < 2) return ['Last name must be at least 2 characters'];
        if (last_name.trim().length > 100) return ['Last name must be less than 100 characters'];

        // Validar phone
        if (!phone) return ['Phone is required'];
        if (typeof phone !== 'string') return ['Phone must be a string'];
        if (phone.trim().length < 8) return ['Phone must be at least 8 characters'];
        if (phone.trim().length > 20) return ['Phone must be less than 20 characters'];

        // Validar message
        if (!message) return ['Message is required'];
        if (typeof message !== 'string') return ['Message must be a string'];
        if (message.trim().length < 10) return ['Message must be at least 10 characters'];
        if (message.trim().length > 1000) return ['Message must be less than 1000 characters'];

        // Validar email (opcional)
        if (email !== undefined && email !== null && email !== '') {
            if (typeof email !== 'string') return ['Email must be a string'];
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) return ['Invalid email format'];
            if (email.length > 255) return ['Email must be less than 255 characters'];
        }

        // Normalizar teléfono para que quepa en la BD (máximo 15 caracteres)
        const normalizedPhone = normalizePhone(phone.trim());

        return [
            undefined,
            new CreatePropertyConsultationDto(
                propertyIdNumber,
                first_name.trim(),
                last_name.trim(),
                normalizedPhone,
                message.trim(),
                email && email.trim() !== '' ? email.trim() : undefined
            )
        ];
    }
}
