import { Router } from 'express';
import { ConsultationController } from './controller';
import { PropertyConsultationServices } from '../services/property-consultation.services';

export class ConsultationRoutes {
    static get routes(): Router {
        const router = Router();
        
        const consultationServices = new PropertyConsultationServices();
        const controller = new ConsultationController(consultationServices);

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
