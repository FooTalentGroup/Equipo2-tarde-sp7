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
    /**
     * @swagger
     * /auth/login:
     *   post:
     *     summary: Login a user
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *               - password
     *             properties:
     *               email:
     *                 type: string
     *               password:
     *                 type: string
     *     responses:
     *       200:
     *         description: Login successful
     *       400:
     *         description: Bad request
     */
    router.post('/login', (req, res) => controller.loginUser(req, res));

    /**
     * @swagger
     * /auth/register:
     *   post:
     *     summary: Register a new user
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - name
     *               - email
     *               - password
     *             properties:
     *               name:
     *                 type: string
     *               email:
     *                 type: string
     *               password:
     *                 type: string
     *     responses:
     *       201:
     *         description: User created
     *       400:
     *         description: Bad request
     */
    router.post('/register', (req, res) => controller.registerUser(req, res));
    router.get('/validate-email/:token', (req, res) => controller.validateEmail(req, res));
    
    // Rutas protegidas (requieren autenticación)
    router.get('/me', authMiddleware.authenticate, (req, res) => controller.getProfile(req, res));

    return router;
  }
}

