/**
 * Use Case: Validar datos de cliente
 * Regla de negocio pura, sin dependencias externas
 */
export class ValidateClientDataUseCase {
    static execute(data: {
        first_name?: string;
        last_name?: string;
        email?: string;
        phone?: string;
        dni?: string;
    }): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];
        
        // Validar nombres
        if (data.first_name !== undefined) {
            if (!data.first_name || data.first_name.trim().length === 0) {
                errors.push('First name cannot be empty');
            } else if (data.first_name.trim().length < 2) {
                errors.push('First name must be at least 2 characters');
            }
        }
        
        if (data.last_name !== undefined) {
            if (!data.last_name || data.last_name.trim().length === 0) {
                errors.push('Last name cannot be empty');
            } else if (data.last_name.trim().length < 2) {
                errors.push('Last name must be at least 2 characters');
            }
        }
        
        // Validar email si se proporciona
        if (data.email !== undefined && data.email !== null && data.email.trim().length > 0) {
            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            if (!emailRegex.test(data.email.trim())) {
                errors.push('Email format is invalid');
            }
        }
        
        // Validar DNI si se proporciona (formato básico)
        if (data.dni !== undefined && data.dni !== null && data.dni.trim().length > 0) {
            if (data.dni.trim().length < 5) {
                errors.push('DNI must be at least 5 characters');
            }
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

