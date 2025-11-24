import { Request, Response, NextFunction } from 'express';

/**
 * Middleware de CORS
 * Permite configurar los orígenes permitidos
 */
export class CorsMiddleware {
    static configure(allowedOrigins: string[] = ['*']) {
        return (req: Request, res: Response, next: NextFunction) => {
            const origin = req.headers.origin;
            
            // Si se permite cualquier origen
            if (allowedOrigins.includes('*')) {
                res.header('Access-Control-Allow-Origin', '*');
            } else if (origin && allowedOrigins.includes(origin)) {
                res.header('Access-Control-Allow-Origin', origin);
            }
            
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            res.header('Access-Control-Allow-Credentials', 'true');
            
            // Manejar preflight requests
            if (req.method === 'OPTIONS') {
                return res.sendStatus(200);
            }
            
            next();
        };
    }
}

