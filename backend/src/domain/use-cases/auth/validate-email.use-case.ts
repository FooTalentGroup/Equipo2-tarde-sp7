/**
 * Use Case: Validar formato de email
 * Regla de negocio pura, sin dependencias externas
 */
export class ValidateEmailUseCase {
    static execute(email: string): boolean {
        if (!email || email.trim().length === 0) {
            return false;
        }
        
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return emailRegex.test(email.trim());
    }
}

