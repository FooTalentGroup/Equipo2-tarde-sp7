import { 
    validateFirstName, 
    validateLastName, 
    validatePhone, 
    validateEmail, 
    validatePropertyId 
} from '../../utils/client-validation.util';

/**
 * DTO para crear un Lead con consulta y propiedad de interés
 * Incluye todos los datos del formulario de creación de Lead
 */
export class CreateLeadDto {
    constructor(
        // Datos básicos del cliente (requeridos)
        public readonly first_name: string,
        public readonly last_name: string,
        public readonly phone: string,
        public readonly email: string,
        
        // Datos opcionales del cliente
        public readonly notes?: string,
        
        // Datos de la consulta
        public readonly consultation_type_id?: number,
        public readonly consultation_type?: string, // Acepta nombre o ID
        
        // Propiedad de interés (opcional)
        public readonly property_id?: number,
    ) {}

    static create(object: { [key: string]: any }): [string?, CreateLeadDto?] {
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

        // Validar campos requeridos del cliente usando utilidades compartidas
        const firstNameError = validateFirstName(first_name);
        if (firstNameError[0]) return [firstNameError[0], undefined];
        
        const lastNameError = validateLastName(last_name);
        if (lastNameError[0]) return [lastNameError[0], undefined];
        
        const phoneError = validatePhone(phone);
        if (phoneError[0]) return [phoneError[0], undefined];

        // Validar email (requerido para Leads)
        const emailError = validateEmail(email, true);
        if (emailError[0]) return [emailError[0], undefined];

        // Validar consultation_type si se proporciona
        if (consultation_type_id && consultation_type) {
            return ['Provide either consultation_type_id OR consultation_type name, not both', undefined];
        }

        if (consultation_type_id && isNaN(Number(consultation_type_id))) {
            return ['Consultation type ID must be a number', undefined];
        }

        // Validar property_id si se proporciona
        const propertyIdError = validatePropertyId(property_id);
        if (propertyIdError[0]) return [propertyIdError[0], undefined];

        return [
            undefined,
            new CreateLeadDto(
                first_name.trim(),
                last_name.trim(),
                phone.trim(),
                email.trim(),
                notes?.trim(),
                consultation_type_id ? Number(consultation_type_id) : undefined,
                consultation_type?.trim(),
                property_id ? Number(property_id) : undefined
            )
        ];
    }
}

