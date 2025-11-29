import { Router } from 'express';
import { ConsultationController } from './controller';
import { PropertyConsultationServices } from '../services/property-consultation.services';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { jwtAdapter } from '../../config';

export class ConsultationRoutes {
    static get routes(): Router {
        const router = Router();
        
        const consultationServices = new PropertyConsultationServices();
        const controller = new ConsultationController(consultationServices);
        const authMiddleware = new AuthMiddleware(jwtAdapter);

        /**
         * @swagger
         * /api/consultations:
         *   get:
         *     summary: Get all consultations with pagination and filters
         *     description: |
         *       Protected endpoint to retrieve all property consultations.
         *       - Requires authentication
         *       - Supports pagination and filtering
         *       - Returns complete information (client, property, consultation type)
         *     tags: [Consultations]
         *     security:
         *       - bearerAuth: []
         *     parameters:
         *       - in: query
         *         name: limit
         *         schema:
         *           type: integer
         *           default: 50
         *         description: Number of results per page
         *       - in: query
         *         name: offset
         *         schema:
         *           type: integer
         *           default: 0
         *         description: Number of results to skip
         *       - in: query
         *         name: consultation_type_id
         *         schema:
         *           type: integer
         *         description: Filter by consultation type ID
         *       - in: query
         *         name: start_date
         *         schema:
         *           type: string
         *           format: date
         *         description: Filter consultations from this date
         *         example: "2025-11-01"
         *       - in: query
         *         name: end_date
         *         schema:
         *           type: string
         *           format: date
         *         description: Filter consultations until this date
         *         example: "2025-11-30"
         *     responses:
         *       200:
         *         description: List of consultations retrieved successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 consultations:
         *                   type: array
         *                   items:
         *                     type: object
         *                     properties:
         *                       id:
         *                         type: integer
         *                       consultation_date:
         *                         type: string
         *                         format: date-time
         *                       message:
         *                         type: string
         *                       response:
         *                         type: string
         *                         nullable: true
         *                       response_date:
         *                         type: string
         *                         format: date-time
         *                         nullable: true
         *                       client:
         *                         type: object
         *                         properties:
         *                           id:
         *                             type: integer
         *                           first_name:
         *                             type: string
         *                           last_name:
         *                             type: string
         *                           email:
         *                             type: string
         *                           phone:
         *                             type: string
         *                       property:
         *                         type: object
         *                         nullable: true
         *                         properties:
         *                           id:
         *                             type: integer
         *                           title:
         *                             type: string
         *                       consultation_type:
         *                         type: object
         *                         properties:
         *                           id:
         *                             type: integer
         *                           name:
         *                             type: string
         *                 pagination:
         *                   type: object
         *                   properties:
         *                     total:
         *                       type: integer
         *                     limit:
         *                       type: integer
         *                     offset:
         *                       type: integer
         *                     hasMore:
         *                       type: boolean
         *       401:
         *         description: Unauthorized - Authentication required
         *       500:
         *         description: Internal server error
         */
        router.get(
            '/',
            authMiddleware.authenticate,
            (req, res) => controller.getAllConsultations(req, res)
        );

        /**
         * @swagger
         * /api/consultations/property:
         *   post:
         *     summary: Create a property consultation from public website
         *     description: |
         *       Public endpoint to submit property consultations from the website.
         *       - Validates that the property exists and is available
         *       - Searches for existing client by phone or email
         *       - Creates new client as "Lead" if not found
         *       - Records the consultation with type "Consulta Web"
         *     tags: [Consultations]
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required:
         *               - property_id
         *               - first_name
         *               - last_name
         *               - phone
         *               - message
         *             properties:
         *               property_id:
         *                 type: integer
         *                 description: ID of the property being consulted
         *                 example: 1
         *               first_name:
         *                 type: string
         *                 minLength: 2
         *                 maxLength: 100
         *                 description: Client's first name
         *                 example: Juan
         *               last_name:
         *                 type: string
         *                 minLength: 2
         *                 maxLength: 100
         *                 description: Client's last name
         *                 example: Pérez
         *               phone:
         *                 type: string
         *                 minLength: 8
         *                 maxLength: 20
         *                 description: Client's phone number
         *                 example: "+54 221 123-4567"
         *               message:
         *                 type: string
         *                 minLength: 10
         *                 maxLength: 1000
         *                 description: Consultation message
         *                 example: "Me interesa esta propiedad. ¿Podría agendar una visita para la próxima semana?"
         *               email:
         *                 type: string
         *                 format: email
         *                 maxLength: 255
         *                 description: Client's email (optional)
         *                 example: juan.perez@example.com
         *     responses:
         *       201:
         *         description: Consultation created successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: Consultation submitted successfully
         *                 consultation:
         *                   type: object
         *                   properties:
         *                     id:
         *                       type: integer
         *                       example: 1
         *                     client_id:
         *                       type: integer
         *                       example: 5
         *                     property_id:
         *                       type: integer
         *                       example: 1
         *                     message:
         *                       type: string
         *                       example: "Me interesa esta propiedad. ¿Podría agendar una visita para la próxima semana?"
         *                     consultation_date:
         *                       type: string
         *                       format: date-time
         *                       example: "2025-11-29T19:07:00.000Z"
         *                 property:
         *                   type: object
         *                   properties:
         *                     id:
         *                       type: integer
         *                       example: 1
         *                     title:
         *                       type: string
         *                       example: "Casa en venta - 3 dormitorios"
         *                 client:
         *                   type: object
         *                   properties:
         *                     id:
         *                       type: integer
         *                       example: 5
         *                     first_name:
         *                       type: string
         *                       example: Juan
         *                     last_name:
         *                       type: string
         *                       example: Pérez
         *                     email:
         *                       type: string
         *                       example: juan.perez@example.com
         *       400:
         *         description: Bad request - Validation error
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: "First name must be at least 2 characters"
         *       404:
         *         description: Property not found or not available
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: "Property not found or not available"
         *       500:
         *         description: Internal server error
         *         content:
         *           application/json:
         *             schema:
         *               type: object
         *               properties:
         *                 message:
         *                   type: string
         *                   example: "Error creating consultation"
         */
        router.post(
            '/property',
            (req, res) => controller.createPropertyConsultation(req, res)
        );

        return router;
    }
}
