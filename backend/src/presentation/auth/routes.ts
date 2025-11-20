import { Router } from 'express';
import { bcryptAdapter, jwtAdapter } from '../../config';
import { AuthController } from './controller';
import { AuthServices } from '../services/auth.services';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class Authroutes {
  static get routes(): Router {
    const router = Router();
    const authServices = new AuthServices(bcryptAdapter, jwtAdapter);
    const controller = new AuthController(authServices);
    const authMiddleware = new AuthMiddleware(jwtAdapter);
        
    // Rutas públicas
    router.post('/login', (req, res) => controller.loginUser(req, res));
    router.post('/register', (req, res) => controller.registerUser(req, res));
    router.get('/validate-email/:token', (req, res) => controller.validateEmail(req, res));
    
    // Rutas protegidas (requieren autenticación)
    router.get('/me', authMiddleware.authenticate, (req, res) => controller.getProfile(req, res));

    return router;
  }
}

