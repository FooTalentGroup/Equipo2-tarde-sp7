/**
 * Use Case: Validar fortaleza de contraseña
 * Regla de negocio pura, sin dependencias externas
 */
export class ValidatePasswordUseCase {
    static execute(password: string): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];
        
        if (!password || password.length === 0) {
            errors.push('Password is required');
            return { isValid: false, errors };
        }
        
        if (password.length < 6) {
            errors.push('Password must be at least 6 characters');
        }
        
        if (password.length > 100) {
            errors.push('Password must be less than 100 characters');
        }
        
        // Opcional: Validar complejidad
        // if (!/[A-Z]/.test(password)) {
        //     errors.push('Password must contain at least one uppercase letter');
        // }
        // if (!/[a-z]/.test(password)) {
        //     errors.push('Password must contain at least one lowercase letter');
        // }
        // if (!/[0-9]/.test(password)) {
        //     errors.push('Password must contain at least one number');
        // }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

