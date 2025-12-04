import { Router } from 'express';
import { ClientController } from './controller';
import { ClientServices } from '../services/client.services';
import { TenantServices } from '../services/tenant.services';
import { OwnerServices } from '../services/owner.services';
import { LeadServices } from '../services/lead.services';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { jwtAdapter } from '../../config';

export class ClientRoutes {
    static get routes(): Router {
        const router = Router();
        
        const clientServices = new ClientServices();
        const tenantServices = new TenantServices();
        const ownerServices = new OwnerServices();
        const leadServices = new LeadServices();
        const controller = new ClientController(
            clientServices,
            tenantServices,
            ownerServices,
            leadServices
        );
        const authMiddleware = new AuthMiddleware(jwtAdapter);

        /**
         * @swagger
         * /api/clients/tenants:
         *   post:
         *     summary: Create a new tenant with property and rental contract
         *     tags: [Clients]
         *     security:
         *       - bearerAuth: []
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/CreateTenantDto'
         *     responses:
         *       201:
         *         description: Tenant created successfully
         *       400:
         *         description: Bad request
         *       401:
         *         description: Unauthorized
         */
        router.post(
            '/tenants',
            authMiddleware.authenticate,
            (req, res) => controller.createTenant(req, res)
        );

        /**
         * @swagger
         * /api/clients/owners:
         *   post:
         *     summary: Create a new owner with optional property association
         *     tags: [Clients]
         *     security:
         *       - bearerAuth: []
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/CreateOwnerDto'
         *     responses:
         *       201:
         *         description: Owner created successfully
         *       400:
         *         description: Bad request
         *       401:
         *         description: Unauthorized
         */
        router.post(
            '/owners',
            authMiddleware.authenticate,
            (req, res) => controller.createOwner(req, res)
        );

        /**
         * @swagger
         * /api/clients/leads:
         *   post:
         *     summary: Create a new lead with consultation and property of interest
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
         *               - email
         *             properties:
         *               first_name:
         *                 type: string
         *               last_name:
         *                 type: string
         *               phone:
         *                 type: string
         *               email:
         *                 type: string
         *               notes:
         *                 type: string
         *               consultation_type_id:
         *                 type: integer
         *               consultation_type:
         *                 type: string
         *               property_id:
         *                 type: integer
         *     responses:
         *       201:
         *         description: Lead created successfully
         *       400:
         *         description: Bad request
         *       401:
         *         description: Unauthorized
         */
        router.post(
            '/leads',
            authMiddleware.authenticate,
            (req, res) => controller.createLead(req, res)
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
         *   patch:
         *     summary: Update a client (partial update)
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
         *             description: All fields are optional. At least one field must be provided.
         *     responses:
         *       200:
         *         description: Client updated
         *       400:
         *         description: Bad request
         *       404:
         *         description: Client not found
         */
        router.patch(
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




