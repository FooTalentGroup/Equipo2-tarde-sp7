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
     * /api/auth/login:
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
     *                 example: admin@example.com
     *               password:
     *                 type: string
     *                 example: password123
     *     responses:
     *       200:
     *         description: Login successful
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: Login successful
     *                 token:
     *                   type: string
     *                   description: JWT token to use in Authorization header (Bearer token)
     *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBleGFtcGxlLmNvbSIsInJvbGVfaWQiOjEsImlhdCI6MTY5OTk5OTk5OSwiZXhwIjoxNzAwMDg2Mzk5fQ.example_signature
     *                 user:
     *                   type: object
     *                   properties:
     *                     id:
     *                       type: integer
     *                       example: 1
     *                     email:
     *                       type: string
     *                       example: admin@example.com
     *                     first_name:
     *                       type: string
     *                       example: Admin
     *                     last_name:
     *                       type: string
     *                       example: User
     *                     role_id:
     *                       type: integer
     *                       example: 1
     *       400:
     *         description: Bad request
     *       401:
     *         description: Invalid credentials
     */
    router.post('/login', (req, res) => controller.loginUser(req, res));

    /**
     * @swagger
     * /api/auth/register:
     *   post:
     *     summary: Register a new user (Admin only)
     *     tags: [Auth]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - first_name
     *               - last_name
     *               - email
     *               - password
     *             properties:
     *               first_name:
     *                 type: string
     *               last_name:
     *                 type: string
     *               email:
     *                 type: string
     *               password:
     *                 type: string
     *               phone:
     *                 type: string
     *               role_id:
     *                 type: integer
     *     responses:
     *       201:
     *         description: User created
     *       400:
     *         description: Bad request
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Admin access required
     */
    router.post(
        '/register', 
        authMiddleware.authenticate,
        authMiddleware.requireAdmin,
        (req, res) => controller.registerUser(req, res)
    );
    router.get('/validate-email/:token', (req, res) => controller.validateEmail(req, res));
    
    // Rutas protegidas (requieren autenticación)
    /**
     * @swagger
     * /api/auth/me:
     *   get:
     *     summary: Get current user profile
     *     tags: [Auth]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: User profile retrieved successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: integer
     *                   example: 1
     *                 email:
     *                   type: string
     *                   example: admin@example.com
     *                 first_name:
     *                   type: string
     *                   example: Admin
     *                 last_name:
     *                   type: string
     *                   example: User
     *                 phone:
     *                   type: string
     *                   example: +541112345678
     *                 role_id:
     *                   type: integer
     *                   example: 1
     *       401:
     *         description: Unauthorized - Invalid or missing token
     */
    router.get('/me', authMiddleware.authenticate, (req, res) => controller.getProfile(req, res));

    return router;
  }
}

