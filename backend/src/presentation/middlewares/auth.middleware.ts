import { Request, Response, NextFunction } from 'express';
import { JwtAdapter } from '../../domain';
import { CustomError } from '../../domain';
import { ProfileModel, RoleModel } from '../../data/postgres/models';
import { RevokedTokenModel } from '../../data/postgres/models/revoked-token.model';

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
            
            // Check if token has been revoked (blacklist)
            if (payload.jti) {
                const isRevoked = await RevokedTokenModel.isRevoked(payload.jti);
                
                if (isRevoked) {
                    return res.status(401).json({
                        message: 'Token has been revoked. Please login again.'
                    });
                }
            }
            
            // Agregar información del usuario al request
            req.user = payload;
            
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

    /**
     * Middleware que verifica que el usuario autenticado sea admin
     * Usa el rol del token para evitar consultas innecesarias a la BD
     * Debe usarse después de authenticate
     */
    requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user;
            
            if (!user || !user.id) {
                return res.status(401).json({
                    message: 'User not authenticated'
                });
            }

            // Verificar rol desde el token (más eficiente)
            const userRole = user.role?.toLowerCase();
            
            if (userRole !== 'admin') {
                // Si no hay rol en el token o no es admin, verificar en BD (backup)
                const userId = typeof user.id === 'string' ? parseInt(user.id, 10) : user.id;
                const profile = await ProfileModel.findById(userId);
                
                if (!profile) {
                    return res.status(401).json({
                        message: 'User not found'
                    });
                }

                const role = await RoleModel.findById(profile.role_id);
                
                if (!role || role.name.toLowerCase() !== 'admin') {
                    return res.status(403).json({
                        message: 'Admin access required'
                    });
                }

                // Actualizar el rol en el request si estaba faltante
                req.user = {
                    ...user,
                    role: role.name,
                    isAdmin: true
                };
            } else {
                // El token ya tiene el rol de admin
                req.user = {
                    ...user,
                    isAdmin: true
                };
            }
            
            next();
        } catch (error) {
            if (error instanceof CustomError) {
                return res.status(error.statusCode).json({
                    message: error.message
                });
            }
            
            return res.status(500).json({
                message: 'Error verifying admin access'
            });
        }
    }

    /**
     * Middleware que verifica que el usuario autenticado sea admin O el dueño del recurso
     * Útil para permitir que usuarios editen su propio perfil o que admins editen cualquier perfil
     * Debe usarse después de authenticate
     */
    requireAdminOrOwner = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user;
            
            if (!user || !user.id) {
                return res.status(401).json({
                    message: 'User not authenticated'
                });
            }

            // Verificar rol desde el token primero
            const userRole = user.role?.toLowerCase();
            let isAdmin = userRole === 'admin';
            
            // Si no hay rol en el token, obtenerlo de la BD
            if (!userRole) {
                const userId = typeof user.id === 'string' ? parseInt(user.id, 10) : user.id;
                const profile = await ProfileModel.findById(userId);
                
                if (!profile) {
                    return res.status(401).json({
                        message: 'User not found'
                    });
                }

                const role = await RoleModel.findById(profile.role_id);
                isAdmin = !!(role && role.name.toLowerCase() === 'admin');
                
                // Actualizar el rol en el request
                req.user = {
                    ...user,
                    role: role?.name || null
                };
            }

            // Obtener el ID del recurso desde los parámetros de la ruta
            const resourceId = req.params.id;
            if (!resourceId) {
                return res.status(400).json({
                    message: 'Resource ID is required'
                });
            }

            const resourceIdNumber = parseInt(resourceId, 10);
            if (isNaN(resourceIdNumber)) {
                return res.status(400).json({
                    message: 'Invalid resource ID'
                });
            }

            // Verificar si es admin o si es el dueño del recurso
            const userId = typeof user.id === 'string' ? parseInt(user.id, 10) : user.id;
            const isOwner = userId === resourceIdNumber;
            
            if (!isAdmin && !isOwner) {
                return res.status(403).json({
                    message: 'Access denied. You can only edit your own profile or must be an admin'
                });
            }

            // Agregar información completa del usuario al request
            if (req.user) {
                req.user = {
                    ...req.user,
                    isAdmin
                };
            }
            
            next();
        } catch (error) {
            if (error instanceof CustomError) {
                return res.status(error.statusCode).json({
                    message: error.message
                });
            }
            
            return res.status(500).json({
                message: 'Error verifying access'
            });
        }
    }
}

