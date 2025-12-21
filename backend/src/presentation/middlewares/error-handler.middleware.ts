import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../../domain';


export class ErrorHandlerMiddleware {
    static handle = (
        error: unknown,
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({
                message: error.message,
                statusCode: error.statusCode
            });
        }
        
        if (error instanceof Error) {
            console.error('Error:', error);
            return res.status(500).json({
                message: error.message || 'Internal server error',
                statusCode: 500
            });
        }
        
        console.error('Unknown error:', error);
        return res.status(500).json({
            message: 'Internal server error',
            statusCode: 500
        });
    }
}

