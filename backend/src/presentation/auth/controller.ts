import { Request, Response } from 'express';
import { CustomError, LoginProfileDto, RegisterProfileDto } from '../../domain';
import type { JwtPayload } from '../../domain/interfaces/jwt-payload';
import { AuthServices } from '../services/auth.services';
import { RevokedTokenModel } from '../../data/postgres/models/revoked-token.model';
import { jwtAdapter } from '../../config';

export class AuthController {

    // DI
    constructor(
        private readonly authServices: AuthServices
    ){}

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({
                message: error.message
            });
        }
        console.log(`error: ${error}`);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }


    registerUser(req: Request, res: Response){
        const [error, registerDto] = RegisterProfileDto.create(req.body);

        if (error || !registerDto) {
            return res.status(400).json({
                message: error || 'Invalid data'
            });
        }

        this.authServices.registerProfile(registerDto)
        .then( result => {
            res.json(result);
        })
        .catch( error => {
            this.handleError(error, res);
        });
        
    }

    loginUser(req: Request, res: Response){
        const [error, loginDto] = LoginProfileDto.create(req.body);

        if (error || !loginDto) {
            return res.status(400).json({
                message: error || 'Invalid data'
            });
        }

        this.authServices.loginProfile(loginDto)
        .then( result => {
            res.json(result);
        })
        .catch( error => {
            this.handleError(error, res);
        });
    }

    validateEmail(req: Request, res: Response){
        res.json({
            message: 'validate email'
        });
    }

    getProfile(req: Request, res: Response){
        const user = req.user;
        
        if (!user || !user.id) {
            return res.status(401).json({
                message: 'User not authenticated'
            });
        }

        this.authServices.getProfile(user.id)
        .then( result => {
            res.json(result);
        })
        .catch( error => {
            this.handleError(error, res);
        });
    }

    /**
     * Logout - Revoke current JWT token
     */
    logout = async (req: Request, res: Response) => {
        try {
            const user = req.user;
            const authHeader = req.headers.authorization;
            
            if (!user || !user.id) {
                return res.status(401).json({
                    message: 'User not authenticated'
                });
            }
            
            if (!authHeader) {
                return res.status(400).json({
                    message: 'Token is required'
                });
            }
            
            const token = authHeader.split(' ')[1];
            const decodedToken: JwtPayload | null = await jwtAdapter.validateToken(token);
            
            if (!decodedToken || !decodedToken.jti) {
                return res.status(400).json({
                    message: 'Invalid token'
                });
            }
            
            const expiresAt = decodedToken.exp 
                ? new Date(decodedToken.exp * 1000)
                : new Date(Date.now() + 24 * 60 * 60 * 1000);
            
            const ip = req.ip || req.socket.remoteAddress;
            const userAgent = req.headers['user-agent'];
            
            await RevokedTokenModel.create({
                token_jti: decodedToken.jti,
                user_id: parseInt(user.id),
                expires_at: expiresAt,
                reason: 'logout',
                ip_address: ip,
                user_agent: userAgent
            });
            
            return res.json({
                message: 'Logged out successfully'
            });
        } catch (error) {
            this.handleError(error, res);
        }
    };

}