import { Response } from 'express';
import { CustomError } from '../../domain';


export class ErrorHandlerUtil {
    
    /**
     * Maneja errores y retorna respuesta HTTP apropiada
     * @param error - Error a manejar
     * @param res - Objeto Response de Express
     * @param controllerName - Nombre del controlador para logging (opcional)
     */
    static handleError(error: unknown, res: Response, controllerName?: string): void {
        if (error instanceof CustomError) {
            res.status(error.statusCode).json({
                message: error.message
            });
            return;
        }

        if (error && typeof error === 'object' && 'code' in error) {
            const pgError = error as Error & { code?: string; constraint?: string; detail?: string; column?: string };
            
            if (pgError.code === '23505') {
                const constraint = pgError.constraint || '';
                const detail = pgError.detail || '';
                
                if (constraint.includes('email')) {
                    const emailMatch = detail.match(/\(email\)=\(([^)]+)\)/);
                    const email = emailMatch ? emailMatch[1] : 'el email proporcionado';
                    res.status(409).json({
                        message: `El email ${email} ya está registrado. Por favor, use otro email.`
                    });
                    return;
                }
                
                if (constraint.includes('dni')) {
                    const dniMatch = detail.match(/\(dni\)=\(([^)]+)\)/);
                    const dni = dniMatch ? dniMatch[1] : 'el DNI proporcionado';
                    res.status(409).json({
                        message: `El DNI ${dni} ya está registrado. Por favor, use otro DNI.`
                    });
                    return;
                }
                
                if (constraint.includes('phone')) {
                    res.status(409).json({
                        message: 'El teléfono ya está registrado. Por favor, use otro teléfono.'
                    });
                    return;
                }
                
                res.status(409).json({
                    message: 'Ya existe un registro con estos datos. Por favor, verifique la información.'
                });
                return;
            }
            
            if (pgError.code === '23503') {
                res.status(400).json({
                    message: 'Los datos proporcionados no son válidos. Verifique las referencias a otros registros.'
                });
                return;
            }
            
            if (pgError.code === '23502') {
                const column = pgError.column || 'campo';
                res.status(400).json({
                    message: `El campo ${column} es requerido y no puede estar vacío.`
                });
                return;
            }
            
            if (pgError.code === '22001') {
                const errorMessage = pgError.message || '';
                let fieldName = 'campo';
                
                if (errorMessage.includes('phone')) {
                    fieldName = 'teléfono';
                } else if (errorMessage.includes('dni')) {
                    fieldName = 'DNI';
                } else if (errorMessage.includes('email')) {
                    fieldName = 'email';
                }
                
                res.status(400).json({
                    message: `El valor del campo ${fieldName} es demasiado largo. Por favor, verifique que no exceda el límite permitido.`
                });
                return;
            }
        }

        const controllerLabel = controllerName ? `${controllerName} ` : '';
        console.error(`${controllerLabel}Controller Error:`, error);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
}

