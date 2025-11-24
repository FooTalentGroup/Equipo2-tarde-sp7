import { Request, Response, NextFunction } from 'express';
import { JwtAdapter } from '../../domain';
import { CustomError } from '../../domain';

/**
 * Middleware de autenticación JWT
 * Verifica que el token sea válido y extrae el usuario
 */
export class AuthMiddleware {
    constructor(
        private readonly jwtAdapter: JwtAdapter
    ) {}

    authenticate = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Obtener token del header Authorization
            const authHeader = req.headers.authorization;
            
            if (!authHeader) {
                return res.status(401).json({
                    message: 'Authorization header is required'
                });
            }
            
            // Formato: "Bearer <token>"
            const parts = authHeader.split(' ');
            if (parts.length !== 2 || parts[0] !== 'Bearer') {
                return res.status(401).json({
                    message: 'Invalid authorization format. Expected: Bearer <token>'
                });
            }
            
            const token = parts[1];
            
            // Verificar y decodificar token
            const payload = await this.jwtAdapter.validateToken(token);
            
            if (!payload) {
                return res.status(401).json({
                    message: 'Invalid or expired token'
                });
            }
            
            // Agregar información del usuario al request
            (req as any).user = payload;
            
            next();
        } catch (error) {
            if (error instanceof CustomError) {
                return res.status(error.statusCode).json({
                    message: error.message
                });
            }
            
            return res.status(401).json({
                message: 'Authentication failed'
            });
        }
    }
}

