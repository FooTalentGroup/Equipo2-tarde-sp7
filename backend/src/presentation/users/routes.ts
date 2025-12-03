import { Router } from 'express';
import { UserController } from './controller';
import { UserServices } from '../services/user.services';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { jwtAdapter, bcryptAdapter } from '../../config';

export class UserRoutes {
    static get routes(): Router {
        const router = Router();
        
        const userServices = new UserServices(bcryptAdapter);
        const controller = new UserController(userServices);
        const authMiddleware = new AuthMiddleware(jwtAdapter);

        /**
         * @swagger
         * /api/users:
         *   get:
         *     summary: List all users (Admin only)
         *     tags: [Users]
         *     security:
         *       - bearerAuth: []
         *     responses:
         *       200:
         *         description: List of users with roles
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 users:
         *                   type: array
         *                   items:
         *                     type: object
         *                     properties:
         *                       id:
         *                         type: integer
         *                       first_name:
         *                         type: string
         *                       last_name:
         *                         type: string
         *                       email:
         *                         type: string
         *                       phone:
         *                         type: string
         *                       active:
         *                         type: boolean
         *                       role:
         *                         type: string
         *                       created_at:
         *                         type: string
         *                         format: date-time
         *                 count:
         *                   type: integer
         *       401:
         *         description: Unauthorized
         *       403:
         *         description: Admin access required
         */
        router.get(
            '/',
            authMiddleware.authenticate,
            authMiddleware.requireAdmin,
            (req, res) => controller.listUsers(req, res)
        );

        /**
         * @swagger
         * /api/users/{id}:
         *   get:
         *     summary: Get a user by ID (Admin only)
         *     tags: [Users]
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: integer
         *         description: User ID
         *     responses:
         *       200:
         *         description: User details
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 user:
         *                   type: object
         *                   properties:
         *                     id:
         *                       type: integer
         *                     first_name:
         *                       type: string
         *                     last_name:
         *                       type: string
         *                     email:
         *                       type: string
         *                     phone:
         *                       type: string
         *                     active:
         *                       type: boolean
         *                     role:
         *                       type: string
         *                     created_at:
         *                       type: string
         *                       format: date-time
         *       404:
         *         description: User not found
         *       401:
         *         description: Unauthorized
         *       403:
         *         description: Admin access required
         */
        router.get(
            '/:id',
            authMiddleware.authenticate,
            authMiddleware.requireAdmin,
            (req, res) => controller.getUserById(req, res)
        );

        /**
         * @swagger
         * /api/users/{id}:
         *   put:
         *     summary: Update a user (Admin can update any user, users can only update themselves)
         *     tags: [Users]
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: integer
         *         description: User ID
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               first_name:
         *                 type: string
         *               last_name:
         *                 type: string
         *               email:
         *                 type: string
         *               phone:
         *                 type: string
         *               password:
         *                 type: string
         *               role:
         *                 type: string
         *                 enum: [admin, agent]
         *                 description: Role name (Only admin can change this). Use 'admin' or 'agent'
         *               active:
         *                 type: boolean
         *                 description: Only admin can change this
         *     responses:
         *       200:
         *         description: User updated successfully
         *       400:
         *         description: Bad request
         *       401:
         *         description: Unauthorized
         *       403:
         *         description: Access denied
         */
        router.put(
            '/:id',
            authMiddleware.authenticate,
            authMiddleware.requireAdminOrOwner,
            (req, res) => controller.updateUser(req, res)
        );

        /**
         * @swagger
         * /api/users/{id}:
         *   delete:
         *     summary: Soft delete a user (Admin only)
         *     tags: [Users]
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: integer
         *         description: User ID
         *     responses:
         *       200:
         *         description: User deleted successfully
         *       401:
         *         description: Unauthorized
         *       403:
         *         description: Admin access required
         *       404:
         *         description: User not found
         */
        router.delete(
            '/:id',
            authMiddleware.authenticate,
            authMiddleware.requireAdmin,
            (req, res) => controller.deleteUser(req, res)
        );

        return router;
    }
}

