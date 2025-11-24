import { Request, Response } from 'express';
import { CustomError, LoginProfileDto, RegisterProfileDto } from '../../domain';
import { AuthServices } from '../services/auth.services';

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
        const user = (req as any).user;
        
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

}