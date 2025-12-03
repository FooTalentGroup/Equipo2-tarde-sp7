import { Router } from 'express';
import { ClientController } from './controller';
import { ClientServices } from '../services/client.services';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { jwtAdapter } from '../../config';

export class ClientRoutes {
    static get routes(): Router {
        const router = Router();
        
        const clientServices = new ClientServices();
        const controller = new ClientController(clientServices);
        const authMiddleware = new AuthMiddleware(jwtAdapter);

        /**
         * @swagger
         * /api/clients:
         *   post:
         *     summary: Create a new client
         *     tags: [Clients]
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
         *               - phone
         *               - contact_category
         *             properties:
         *               first_name:
         *                 type: string
         *               last_name:
         *                 type: string
         *               phone:
         *                 type: string
         *               contact_category:
         *                 type: string
         *     responses:
         *       201:
         *         description: Client created successfully
         *       400:
         *         description: Bad request
         */
        router.post(
            '/',
            authMiddleware.authenticate,
            (req, res) => controller.createClient(req, res)
        );

        /**
         * @swagger
         * /api/clients:
         *   get:
         *     summary: List clients with optional filters
         *     tags: [Clients]
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: query
         *         name: contact_category_id
         *         schema:
         *           type: integer
         *       - in: query
         *         name: search
         *         schema:
         *           type: string
         *       - in: query
         *         name: limit
         *         schema:
         *           type: integer
         *       - in: query
         *         name: offset
         *         schema:
         *           type: integer
         *     responses:
         *       200:
         *         description: List of clients
         */
        router.get(
            '/',
            authMiddleware.authenticate,
            (req, res) => controller.listClients(req, res)
        );

        /**
         * @swagger
         * /api/clients/{id}:
         *   get:
         *     summary: Get client by ID
         *     tags: [Clients]
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: integer
         *     responses:
         *       200:
         *         description: Client details
         *       404:
         *         description: Client not found
         */
        router.get(
            '/:id',
            authMiddleware.authenticate,
            (req, res) => controller.getClientById(req, res)
        );

        /**
         * @swagger
         * /api/clients/{id}:
         *   put:
         *     summary: Update a client
         *     tags: [Clients]
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: integer
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *     responses:
         *       200:
         *         description: Client updated
         *       404:
         *         description: Client not found
         */
        router.put(
            '/:id',
            authMiddleware.authenticate,
            (req, res) => controller.updateClient(req, res)
        );

        /**
         * @swagger
         * /api/clients/{id}:
         *   delete:
         *     summary: Delete a client (soft delete)
         *     tags: [Clients]
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: integer
         *     responses:
         *       200:
         *         description: Client deleted
         *       404:
         *         description: Client not found
         */
        router.delete(
            '/:id',
            authMiddleware.authenticate,
            (req, res) => controller.deleteClient(req, res)
        );

        /**
         * @swagger
         * /api/clients/{id}/restore:
         *   post:
         *     summary: Restore a deleted client
         *     tags: [Clients]
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *           type: integer
         *     responses:
         *       200:
         *         description: Client restored
         *       404:
         *         description: Client not found
         */
        router.post(
            '/:id/restore',
            authMiddleware.authenticate,
            (req, res) => controller.restoreClient(req, res)
        );

        return router;
    }
}




