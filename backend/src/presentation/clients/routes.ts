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
         *             type: object
         *             required:
         *               - first_name
         *               - last_name
         *               - phone
         *             properties:
         *               first_name:
         *                 type: string
         *                 example: Juan
         *               last_name:
         *                 type: string
         *                 example: Pérez
         *               phone:
         *                 type: string
         *                 example: "+54 11 1234-5678"
         *               email:
         *                 type: string
         *                 example: juan.perez@example.com
         *               dni:
         *                 type: string
         *                 example: "12345678"
         *               address:
         *                 type: string
         *                 example: Av. Corrientes 1234, CABA
         *               notes:
         *                 type: string
         *                 example: Inquilino responsable, referencias verificadas
         *               property_id:
         *                 type: integer
         *                 example: 7
         *               property_address:
         *                 type: string
         *                 example: Calle Falsa 123
         *               contract_start_date:
         *                 type: string
         *                 format: date
         *                 example: "2024-01-01"
         *               contract_end_date:
         *                 type: string
         *                 format: date
         *                 example: "2025-01-01"
         *               next_increase_date:
         *                 type: string
         *                 format: date
         *                 example: "2024-07-01"
         *               monthly_amount:
         *                 type: number
         *                 example: 150000
         *               currency_type_id:
         *                 type: integer
         *                 example: 1
         *               currency_type:
         *                 type: string
         *                 example: ARS
         *               remind_increase:
         *                 type: boolean
         *                 example: true
         *               remind_contract_end:
         *                 type: boolean
         *                 example: true
         *               external_reference:
         *                 type: string
         *                 example: CONTRATO-2024-001
         *     responses:
         *       201:
         *         description: Tenant created successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: Tenant created successfully
         *                 data:
         *                   type: object
         *                   properties:
         *                     client:
         *                       type: object
         *                       properties:
         *                         id:
         *                           type: integer
         *                           example: 1
         *                         first_name:
         *                           type: string
         *                           example: Juan
         *                         last_name:
         *                           type: string
         *                           example: Pérez
         *                         email:
         *                           type: string
         *                           example: juan.perez@example.com
         *                         phone:
         *                           type: string
         *                           example: +541112345678
         *                         dni:
         *                           type: string
         *                           example: "12345678"
         *                         address:
         *                           type: string
         *                           example: Av. Corrientes 1234, CABA
         *                         notes:
         *                           type: string
         *                           example: Inquilino responsable, referencias verificadas
         *                         contact_category_id:
         *                           type: integer
         *                           example: 2
         *                         rental_interest:
         *                           type: boolean
         *                           example: true
         *                     client_rental:
         *                       type: object
         *                       properties:
         *                         id:
         *                           type: integer
         *                           example: 1
         *                         property_id:
         *                           type: integer
         *                           example: 7
         *                         contract_start_date:
         *                           type: string
         *                           format: date
         *                           example: "2024-01-01"
         *                         contract_end_date:
         *                           type: string
         *                           format: date
         *                           example: "2025-01-01"
         *                         next_increase_date:
         *                           type: string
         *                           format: date
         *                           example: "2024-07-01"
         *                     rental:
         *                       type: object
         *                       properties:
         *                         id:
         *                           type: integer
         *                           example: 1
         *                         monthly_amount:
         *                           type: string
         *                           example: "150000.00"
         *                         currency_type_id:
         *                           type: integer
         *                           example: 1
         *                         start_date:
         *                           type: string
         *                           format: date
         *                           example: "2024-01-01"
         *                         end_date:
         *                           type: string
         *                           format: date
         *                           example: "2025-01-01"
         *       400:
         *         description: Bad request
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: Validation error
         *       401:
         *         description: Unauthorized
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: Authorization header is required
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
         *             type: object
         *             required:
         *               - first_name
         *               - last_name
         *               - phone
         *             properties:
         *               first_name:
         *                 type: string
         *                 example: Ana
         *               last_name:
         *                 type: string
         *                 example: Martínez
         *               phone:
         *                 type: string
         *                 example: "+54 11 1111-2222"
         *               email:
         *                 type: string
         *                 example: ana.martinez@example.com
         *               dni:
         *                 type: string
         *                 example: "11223344"
         *               address:
         *                 type: string
         *                 example: Av. Libertador 7890, CABA
         *               notes:
         *                 type: string
         *                 example: Propietaria de departamento en Palermo
         *               property_id:
         *                 type: integer
         *                 example: 1
         *     responses:
         *       201:
         *         description: Owner created successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: Owner created successfully
         *                 data:
         *                   type: object
         *                   properties:
         *                     client:
         *                       type: object
         *                       properties:
         *                         id:
         *                           type: integer
         *                           example: 1
         *                         first_name:
         *                           type: string
         *                           example: Ana
         *                         last_name:
         *                           type: string
         *                           example: Martínez
         *                         email:
         *                           type: string
         *                           example: ana.martinez@example.com
         *                         phone:
         *                           type: string
         *                           example: +541111112222
         *                         dni:
         *                           type: string
         *                           example: "11223344"
         *                         address:
         *                           type: string
         *                           example: Av. Libertador 7890, CABA
         *                         notes:
         *                           type: string
         *                           example: Propietaria de departamento en Palermo
         *                         contact_category_id:
         *                           type: integer
         *                           example: 1
         *                         purchase_interest:
         *                           type: boolean
         *                           example: false
         *                     property:
         *                       type: object
         *                       nullable: true
         *                       description: Property object if property_id was provided and property was associated
         *                       properties:
         *                         id:
         *                           type: integer
         *                           example: 1
         *                         title:
         *                           type: string
         *                           example: Departamento en Palermo
         *                         owner_id:
         *                           type: integer
         *                           example: 1
         *                     info:
         *                       type: string
         *                       nullable: true
         *                       example: Property with ID 1 already has an owner assigned. Owner created but not associated.
         *       400:
         *         description: Bad request
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: Validation error
         *       401:
         *         description: Unauthorized
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: Authorization header is required
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
         *                 example: Pedro
         *               last_name:
         *                 type: string
         *                 example: Gómez
         *               phone:
         *                 type: string
         *                 example: "+54 11 9999-0000"
         *               email:
         *                 type: string
         *                 example: pedro.gomez@example.com
         *               notes:
         *                 type: string
         *                 example: Interesado en departamento de 2 ambientes en Palermo, presupuesto $200.000
         *               consultation_type_id:
         *                 type: integer
         *                 example: 1
         *               consultation_type:
         *                 type: string
         *                 example: Consulta de Alquiler
         *               property_id:
         *                 type: integer
         *                 example: 1
         *     responses:
         *       201:
         *         description: Lead created successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: Lead created successfully
         *                 data:
         *                   type: object
         *                   properties:
         *                     client:
         *                       type: object
         *                       properties:
         *                         id:
         *                           type: integer
         *                           example: 1
         *                         first_name:
         *                           type: string
         *                           example: Pedro
         *                         last_name:
         *                           type: string
         *                           example: Gómez
         *                         email:
         *                           type: string
         *                           example: pedro.gomez@example.com
         *                         phone:
         *                           type: string
         *                           example: "+541199990000"
         *                         notes:
         *                           type: string
         *                           example: Interesado en departamento de 2 ambientes en Palermo, presupuesto $200.000
         *                         contact_category_id:
         *                           type: integer
         *                           example: 3
         *                         rental_interest:
         *                           type: boolean
         *                           example: true
         *                     consultation:
         *                       type: object
         *                       properties:
         *                         id:
         *                           type: integer
         *                           example: 1
         *                         consultation_type_id:
         *                           type: integer
         *                           example: 1
         *                         consultation_type:
         *                           type: object
         *                           properties:
         *                             id:
         *                               type: integer
         *                               example: 1
         *                             name:
         *                               type: string
         *                               example: Consulta de Alquiler
         *                         property_id:
         *                           type: integer
         *                           nullable: true
         *                           example: 1
         *                         message:
         *                           type: string
         *                           nullable: true
         *                           example: Interesado en departamento de 2 ambientes en Palermo, presupuesto $200.000
         *                         is_read:
         *                           type: boolean
         *                           example: false
         *                         created_at:
         *                           type: string
         *                           format: date-time
         *                           example: "2025-12-04T01:44:56.021Z"
         *       400:
         *         description: Bad request
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: Validation error
         *       401:
         *         description: Unauthorized
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: Authorization header is required
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

        /**
         * @swagger
         * /api/clients/{id}/properties-of-interest:
         *   post:
         *     summary: Add a property of interest to a client (Lead or Tenant)
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
         *             required:
         *               - property_id
         *             properties:
         *               property_id:
         *                 type: integer
         *                 example: 123
         *               notes:
         *                 type: string
         *                 example: Cliente interesado en esta propiedad
         *     responses:
         *       201:
         *         description: Property of interest added successfully
         *       400:
         *         description: Bad request
         *       404:
         *         description: Client or property not found
         */
        router.post(
            '/:id/properties-of-interest',
            authMiddleware.authenticate,
            (req, res) => controller.addPropertyOfInterest(req, res)
        );

        /**
         * @swagger
         * /api/clients/{id}/owned-properties:
         *   post:
         *     summary: Associate a property to an Owner
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
         *             required:
         *               - property_id
         *             properties:
         *               property_id:
         *                 type: integer
         *                 example: 123
         *     responses:
         *       200:
         *         description: Property associated with owner successfully
         *       400:
         *         description: Bad request
         *       404:
         *         description: Client or property not found
         */
        router.post(
            '/:id/owned-properties',
            authMiddleware.authenticate,
            (req, res) => controller.addOwnedProperty(req, res)
        );

        return router;
    }
}




