import { Router } from "express";

import { jwtAdapter } from "../../config";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { PropertyConsultationServices } from "../services/property-consultation.services";
import { ConsultationController } from "./controller";

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
		 *       - in: query
		 *         name: is_read
		 *         schema:
		 *           type: boolean
		 *         description: Filter by read status (true = read, false = unread)
		 *         example: false
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
		 *                       is_read:
		 *                         type: boolean
		 *                         description: Whether the consultation has been read
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
		router.get("/", authMiddleware.authenticate, (req, res) =>
			controller.getAllConsultations(req, res),
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
		router.post("/property", (req, res) =>
			controller.createPropertyConsultation(req, res),
		);

		/**
		 * @swagger
		 * /api/consultations/bulk:
		 *   delete:
		 *     summary: Delete multiple consultations
		 *     description: |
		 *       Protected endpoint to delete multiple consultations at once.
		 *       - Requires authentication
		 *       - Validates array of consultation IDs
		 *       - Maximum 100 consultations per request
		 *     tags: [Consultations]
		 *     security:
		 *       - bearerAuth: []
		 *     requestBody:
		 *       required: true
		 *       content:
		 *         application/json:
		 *           schema:
		 *             type: object
		 *             required:
		 *               - consultation_ids
		 *             properties:
		 *               consultation_ids:
		 *                 type: array
		 *                 items:
		 *                   type: integer
		 *                 minItems: 1
		 *                 maxItems: 100
		 *                 description: Array of consultation IDs to delete
		 *                 example: [1, 2, 3, 4, 5]
		 *     responses:
		 *       200:
		 *         description: Consultations deleted successfully
		 *         content:
		 *           application/json:
		 *             schema:
		 *               type: object
		 *               properties:
		 *                 message:
		 *                   type: string
		 *                   example: "5 consultation(s) deleted successfully"
		 *                 deleted_count:
		 *                   type: integer
		 *                   example: 5
		 *       400:
		 *         description: Bad request - Invalid data
		 *       401:
		 *         description: Unauthorized - Authentication required
		 *       500:
		 *         description: Internal server error
		 */
		router.delete("/bulk", authMiddleware.authenticate, (req, res) =>
			controller.deleteMultipleConsultations(req, res),
		);

		/**
		 * @swagger
		 * /api/consultations/{id}/read:
		 *   patch:
		 *     summary: Mark a consultation as read
		 *     description: |
		 *       Protected endpoint to mark a consultation as read.
		 *       - Requires authentication
		 *       - Updates the is_read field to true
		 *     tags: [Consultations]
		 *     security:
		 *       - bearerAuth: []
		 *     parameters:
		 *       - in: path
		 *         name: id
		 *         required: true
		 *         schema:
		 *           type: integer
		 *         description: Consultation ID
		 *         example: 1
		 *     responses:
		 *       200:
		 *         description: Consultation marked as read successfully
		 *         content:
		 *           application/json:
		 *             schema:
		 *               type: object
		 *               properties:
		 *                 message:
		 *                   type: string
		 *                   example: "Consultation marked as read"
		 *                 consultation:
		 *                   type: object
		 *                   description: Updated consultation object
		 *       400:
		 *         description: Bad request - Invalid consultation ID
		 *       401:
		 *         description: Unauthorized - Authentication required
		 *       404:
		 *         description: Consultation not found
		 *       500:
		 *         description: Internal server error
		 */
		router.patch("/:id/read", authMiddleware.authenticate, (req, res) =>
			controller.markAsRead(req, res),
		);

		/**
		 * @swagger
		 * /api/consultations/{id}:
		 *   delete:
		 *     summary: Delete a consultation
		 *     description: |
		 *       Protected endpoint to delete a single consultation.
		 *       - Requires authentication
		 *       - Verifies consultation exists before deletion
		 *     tags: [Consultations]
		 *     security:
		 *       - bearerAuth: []
		 *     parameters:
		 *       - in: path
		 *         name: id
		 *         required: true
		 *         schema:
		 *           type: integer
		 *         description: Consultation ID
		 *         example: 1
		 *     responses:
		 *       200:
		 *         description: Consultation deleted successfully
		 *         content:
		 *           application/json:
		 *             schema:
		 *               type: object
		 *               properties:
		 *                 message:
		 *                   type: string
		 *                   example: "Consultation deleted successfully"
		 *       400:
		 *         description: Bad request - Invalid consultation ID
		 *       401:
		 *         description: Unauthorized - Authentication required
		 *       404:
		 *         description: Consultation not found
		 *       500:
		 *         description: Internal server error
		 */
		router.delete("/:id", authMiddleware.authenticate, (req, res) =>
			controller.deleteConsultation(req, res),
		);

		/**
		 * @swagger
		 * /api/consultations/{id}/convert-to-lead:
		 *   post:
		 *     summary: Convert a consultation to a lead
		 *     description: |
		 *       Protected endpoint to convert a consultation into a client lead.
		 *       - Requires authentication
		 *       - Verifies consultation exists and has no associated client
		 *       - Checks for existing clients by email to prevent duplicates
		 *       - Creates a new lead if no existing client is found
		 *       - Associates the consultation with the client
		 *       - Assigns the consultation to the authenticated user
		 *     tags: [Consultations]
		 *     security:
		 *       - bearerAuth: []
		 *     parameters:
		 *       - in: path
		 *         name: id
		 *         required: true
		 *         schema:
		 *           type: integer
		 *         description: Consultation ID
		 *         example: 1
		 *     responses:
		 *       200:
		 *         description: Consultation converted to lead successfully
		 *         content:
		 *           application/json:
		 *             schema:
		 *               type: object
		 *               properties:
		 *                 message:
		 *                   type: string
		 *                   example: "Consultation converted to lead successfully"
		 *                 consultation:
		 *                   type: object
		 *                   description: Updated consultation with client_id
		 *                 client:
		 *                   type: object
		 *                   properties:
		 *                     id:
		 *                       type: integer
		 *                       example: 5
		 *                     first_name:
		 *                       type: string
		 *                       example: "Juan"
		 *                     last_name:
		 *                       type: string
		 *                       example: "Pérez"
		 *                     email:
		 *                       type: string
		 *                       example: "juan.perez@example.com"
		 *                     phone:
		 *                       type: string
		 *                       example: "+54 221 123-4567"
		 *                 was_new_lead:
		 *                   type: boolean
		 *                   description: True if a new lead was created, false if existing client was used
		 *                   example: true
		 *       400:
		 *         description: Bad request - Consultation already has client or missing data
		 *         content:
		 *           application/json:
		 *             schema:
		 *               type: object
		 *               properties:
		 *                 message:
		 *                   type: string
		 *                   example: "Consultation already has an associated client"
		 *       401:
		 *         description: Unauthorized - Authentication required
		 *       404:
		 *         description: Consultation not found
		 *       500:
		 *         description: Internal server error
		 */
		router.post(
			"/:id/convert-to-lead",
			authMiddleware.authenticate,
			(req, res) => controller.convertConsultationToLead(req, res),
		);

		return router;
	}
}
