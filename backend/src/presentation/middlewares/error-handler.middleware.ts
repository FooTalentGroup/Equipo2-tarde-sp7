import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../../domain';

/**
 * Middleware global de manejo de errores
 * Captura todos los errores y los formatea apropiadamente
 */
export class ErrorHandlerMiddleware {
    static handle = (
        error: unknown,
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        // Si es un CustomError, usar su statusCode y message
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({
                message: error.message,
                statusCode: error.statusCode
            });
        }
        
        // Si es un Error estándar
        if (error instanceof Error) {
            console.error('Error:', error);
            return res.status(500).json({
                message: error.message || 'Internal server error',
                statusCode: 500
            });
        }
        
        // Error desconocido
        console.error('Unknown error:', error);
        return res.status(500).json({
            message: 'Internal server error',
            statusCode: 500
        });
    }
}

