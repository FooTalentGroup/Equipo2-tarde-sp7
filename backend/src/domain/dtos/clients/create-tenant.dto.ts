import { 
    validateFirstName, 
    validateLastName, 
    validatePhone, 
    validateEmail, 
    validateDni, 
    validatePropertyId 
} from '../../utils/client-validation.util';

export class CreateTenantDto {
    constructor(
        public readonly first_name: string,
        public readonly last_name: string,
        public readonly phone: string,
        
        public readonly email?: string,
        public readonly dni?: string,
        public readonly address?: string,
        public readonly notes?: string,
        
        public readonly property_id?: number,
        public readonly property_address?: string, 
        
        public readonly contract_start_date?: string | Date,
        public readonly contract_end_date?: string | Date,
        public readonly next_increase_date?: string | Date,
        public readonly monthly_amount?: number,
        public readonly currency_type_id?: number,
        public readonly currency_type?: string, 
        
        public readonly remind_increase?: boolean,
        public readonly remind_contract_end?: boolean,
        
        public readonly external_reference?: string,
    ) {}

    static create(object: Record<string, unknown>): [string?, CreateTenantDto?] {
        const {
            first_name,
            last_name,
            phone,
            email,
            dni,
            address,
            notes,
            property_id,
            property_address,
            contract_start_date,
            contract_end_date,
            next_increase_date,
            monthly_amount,
            currency_type_id,
            currency_type,
            remind_increase,
            remind_contract_end,
            external_reference,
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

        if (currency_type_id && currency_type) {
            return ['Provide either currency_type_id OR currency_type name, not both', undefined];
        }

        if (currency_type_id && isNaN(Number(currency_type_id))) {
            return ['Currency type ID must be a number', undefined];
        }

        const validateDateString = (date: any, fieldName: string): [string?, void?] => {
            if (!date) return [undefined, undefined];
            
            if (typeof date === 'string') {
                if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
                    return [`Invalid ${fieldName} format. Expected YYYY-MM-DD (e.g., 2025-01-01)`, undefined];
                }
                const [year, month, day] = date.split('-').map(Number);
                const dateObj = new Date(Date.UTC(year, month - 1, day));
                if (dateObj.getUTCFullYear() !== year || 
                    dateObj.getUTCMonth() !== month - 1 || 
                    dateObj.getUTCDate() !== day) {
                    return [`Invalid ${fieldName}. Date does not exist`, undefined];
                }
            } else if (date instanceof Date) {
                if (isNaN(date.getTime())) {
                    return [`Invalid ${fieldName} format`, undefined];
                }
            } else {
                return [`Invalid ${fieldName} format. Expected string (YYYY-MM-DD) or Date`, undefined];
            }
            return [undefined, undefined];
        };

        const startDateError = validateDateString(contract_start_date, 'contract_start_date');
        if (startDateError[0]) return [startDateError[0], undefined];

        const endDateError = validateDateString(contract_end_date, 'contract_end_date');
        if (endDateError[0]) return [endDateError[0], undefined];
        
        if (contract_start_date && contract_end_date) {
            const parseDate = (date: string | Date): Date => {
                if (typeof date === 'string') {
                    const [year, month, day] = date.split('-').map(Number);
                    return new Date(Date.UTC(year, month - 1, day));
                }
                return date;
            };
            
            const startDate = parseDate(contract_start_date as string | Date);
            const endDate = parseDate(contract_end_date as string | Date);
            if (endDate < startDate) {
                return ['Contract end date must be after start date', undefined];
            }
        }

        const increaseDateError = validateDateString(next_increase_date, 'next_increase_date');
        if (increaseDateError[0]) return [increaseDateError[0], undefined];

        if (monthly_amount !== undefined && monthly_amount !== null) {
            if (isNaN(Number(monthly_amount)) || Number(monthly_amount) < 0) {
                return ['Monthly amount must be a positive number', undefined];
            }
        }

        return [
            undefined,
            new CreateTenantDto(
                (first_name as string).trim(),
                (last_name as string).trim(),
                (phone as string).trim(),
                (email as string | undefined)?.trim(),
                (dni as string | undefined)?.trim(),
                (address as string | undefined)?.trim(),
                (notes as string | undefined)?.trim(),
                property_id ? Number(property_id) : undefined,
                (property_address as string | undefined)?.trim(),
                contract_start_date ? (typeof contract_start_date === 'string' 
                    ? contract_start_date 
                    : contract_start_date instanceof Date 
                        ? contract_start_date.toISOString().split('T')[0] 
                        : String(contract_start_date)) : undefined,
                contract_end_date ? (typeof contract_end_date === 'string' 
                    ? contract_end_date 
                    : contract_end_date instanceof Date 
                        ? contract_end_date.toISOString().split('T')[0] 
                        : String(contract_end_date)) : undefined,
                next_increase_date ? (typeof next_increase_date === 'string' 
                    ? next_increase_date 
                    : next_increase_date instanceof Date 
                        ? next_increase_date.toISOString().split('T')[0] 
                        : String(next_increase_date)) : undefined,
                monthly_amount ? Number(monthly_amount) : undefined,
                currency_type_id ? Number(currency_type_id) : undefined,
                (currency_type as string | undefined)?.trim(),
                remind_increase !== undefined ? Boolean(remind_increase) : undefined,
                remind_contract_end !== undefined ? Boolean(remind_contract_end) : undefined,
                (external_reference as string | undefined)?.trim()
            )
        ];
    }
}

