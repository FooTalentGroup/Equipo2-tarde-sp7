import { Request, Response, NextFunction } from 'express';
import { ProfileModel, RoleModel } from '../../data/postgres/models';
import { CustomError } from '../../domain';

/**
 * Middleware de autorización por roles
 * Verifica que el usuario tenga el rol requerido
 */
export class RoleMiddleware {
    /**
     * Verifica que el usuario tenga uno de los roles especificados
     * @param allowedRoles Array de nombres de roles permitidos (ej: ['admin', 'agent'])
     */
    static requireRoles(allowedRoles: string[]) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const user = (req as any).user;
                
                if (!user || !user.id) {
                    return res.status(401).json({
                        message: 'User not authenticated'
                    });
                }
                
                // Obtener perfil del usuario
                const profile = await ProfileModel.findById(user.id);
                if (!profile || !profile.role_id) {
                    return res.status(403).json({
                        message: 'User role not found'
                    });
                }
                
                // Obtener rol
                const role = await RoleModel.findById(profile.role_id);
                if (!role) {
                    return res.status(403).json({
                        message: 'Role not found'
                    });
                }
                
                // Verificar que el rol esté permitido
                if (!allowedRoles.includes(role.title.toLowerCase())) {
                    return res.status(403).json({
                        message: `Access denied. Required roles: ${allowedRoles.join(', ')}`
                    });
                }
                
                // Agregar información del rol al request
                (req as any).userRole = role.title;
                
                next();
            } catch (error) {
                if (error instanceof CustomError) {
                    return res.status(error.statusCode).json({
                        message: error.message
                    });
                }
                
                return res.status(403).json({
                    message: 'Authorization failed'
                });
            }
        };
    }
    
    /**
     * Verifica que el usuario sea admin
     */
    static requireAdmin() {
        return this.requireRoles(['admin']);
    }
    
    /**
     * Verifica que el usuario sea admin o agente
     */
    static requireAdminOrAgent() {
        return this.requireRoles(['admin', 'agent']);
    }
}

