import { Request, Response, NextFunction } from 'express';
import { JwtAdapter } from '../../domain';
import { CustomError } from '../../domain';
import { ProfileModel, RoleModel } from '../../data/postgres/models';
import { RevokedTokenModel } from '../../data/postgres/models/revoked-token.model';

export class AuthMiddleware {
    constructor(
        private readonly jwtAdapter: JwtAdapter
    ) {}

    authenticate = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers.authorization;
            
            if (!authHeader) {
                return res.status(401).json({
                    message: 'Authorization header is required'
                });
            }
            
            const parts = authHeader.split(' ');
            if (parts.length !== 2 || parts[0] !== 'Bearer') {
                return res.status(401).json({
                    message: 'Invalid authorization format. Expected: Bearer <token>'
                });
            }
            
            const token = parts[1];
            
            const payload = await this.jwtAdapter.validateToken(token);
            
            if (!payload) {
                return res.status(401).json({
                    message: 'Invalid or expired token'
                });
            }
            
            if (payload.jti) {
                const isRevoked = await RevokedTokenModel.isRevoked(payload.jti);
                
                if (isRevoked) {
                    return res.status(401).json({
                        message: 'Token has been revoked. Please login again.'
                    });
                }
            }
            
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

    requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user;
            
            if (!user || !user.id) {
                return res.status(401).json({
                    message: 'User not authenticated'
                });
            }

            const userRole = user.role?.toLowerCase();
            
            if (userRole !== 'admin') {
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

                req.user = {
                    ...user,
                    role: role.name,
                    isAdmin: true
                };
            } else {
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

    requireAdminOrOwner = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user;
            
            if (!user || !user.id) {
                return res.status(401).json({
                    message: 'User not authenticated'
                });
            }

            const userRole = user.role?.toLowerCase();
            let isAdmin = userRole === 'admin';
            
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
                
                req.user = {
                    ...user,
                    role: role?.name || null
                };
            }

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

            const userId = typeof user.id === 'string' ? parseInt(user.id, 10) : user.id;
            const isOwner = userId === resourceIdNumber;
            
            if (!isAdmin && !isOwner) {
                return res.status(403).json({
                    message: 'Access denied. You can only edit your own profile or must be an admin'
                });
            }

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

