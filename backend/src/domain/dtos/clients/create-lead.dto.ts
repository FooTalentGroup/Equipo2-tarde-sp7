import { 
    validateFirstName, 
    validateLastName, 
    validatePhone, 
    validateEmail, 
    validatePropertyId 
} from '../../utils/client-validation.util';

export class CreateLeadDto {
    constructor(
        public readonly first_name: string,
        public readonly last_name: string,
        public readonly phone: string,
        public readonly email: string,
        public readonly notes?: string,
        public readonly consultation_type_id?: number,
        public readonly consultation_type?: string,
        public readonly property_id?: number,
    ) {}

    static create(object: Record<string, unknown>): [string?, CreateLeadDto?] {
        const {
            first_name,
            last_name,
            phone,
            email,
            notes,
            consultation_type_id,
            consultation_type,
            property_id,
        } = object;

        const firstNameError = validateFirstName(first_name);
        if (firstNameError[0]) return [firstNameError[0], undefined];
        
        const lastNameError = validateLastName(last_name);
        if (lastNameError[0]) return [lastNameError[0], undefined];
        
        const phoneError = validatePhone(phone);
        if (phoneError[0]) return [phoneError[0], undefined];

        const emailError = validateEmail(email, true);
        if (emailError[0]) return [emailError[0], undefined];

        if (consultation_type_id && consultation_type) {
            return ['Provide either consultation_type_id OR consultation_type name, not both', undefined];
        }

        if (consultation_type_id && isNaN(Number(consultation_type_id))) {
            return ['Consultation type ID must be a number', undefined];
        }

        const propertyIdError = validatePropertyId(property_id);
        if (propertyIdError[0]) return [propertyIdError[0], undefined];

        return [
            undefined,
            new CreateLeadDto(
                (first_name as string).trim(),
                (last_name as string).trim(),
                (phone as string).trim(),
                (email as string).trim(),
                (notes as string | undefined)?.trim(),
                consultation_type_id ? Number(consultation_type_id) : undefined,
                (consultation_type as string | undefined)?.trim(),
                property_id ? Number(property_id) : undefined
            )
        ];
    }
}

