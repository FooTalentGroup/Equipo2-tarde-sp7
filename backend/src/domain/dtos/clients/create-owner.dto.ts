import { 
    validateFirstName, 
    validateLastName, 
    validatePhone, 
    validateEmail, 
    validateDni, 
    validatePropertyId 
} from '../../utils/client-validation.util';

export class CreateOwnerDto {
    constructor(
        public readonly first_name: string,
        public readonly last_name: string,
        public readonly phone: string,
        public readonly email?: string,
        public readonly dni?: string,
        public readonly address?: string,
        public readonly notes?: string,
        public readonly property_id?: number,
    ) {}

    static create(object: Record<string, unknown>): [string?, CreateOwnerDto?] {
        const {
            first_name,
            last_name,
            phone,
            email,
            dni,
            address,
            notes,
            property_id,
        } = object;

        const firstNameError = validateFirstName(first_name);
        if (firstNameError[0]) return [firstNameError[0], undefined];
        
        const lastNameError = validateLastName(last_name);
        if (lastNameError[0]) return [lastNameError[0], undefined];
        
        const phoneError = validatePhone(phone);
        if (phoneError[0]) return [phoneError[0], undefined];

        const emailError = validateEmail(email, false);
        if (emailError[0]) return [emailError[0], undefined];

        const dniError = validateDni(dni);
        if (dniError[0]) return [dniError[0], undefined];

        const propertyIdError = validatePropertyId(property_id);
        if (propertyIdError[0]) return [propertyIdError[0], undefined];

        return [
            undefined,
            new CreateOwnerDto(
                (first_name as string).trim(),
                (last_name as string).trim(),
                (phone as string).trim(),
                (email as string | undefined)?.trim(),
                (dni as string | undefined)?.trim(),
                (address as string | undefined)?.trim(),
                (notes as string | undefined)?.trim(),
                property_id ? Number(property_id) : undefined
            )
        ];
    }
}

