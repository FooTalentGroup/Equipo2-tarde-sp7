import { Router } from 'express';
import { jwtAdapter } from '../../config';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { DashboardServices } from '../services/dashboard.services';
import { DashboardController } from './controller';

export class DashboardRoutes {
	static get routes(): Router {
		const router = Router();

		const dashboardServices = new DashboardServices();
		const controller = new DashboardController(dashboardServices);
		const authMiddleware = new AuthMiddleware(jwtAdapter);

		/**
		 * @swagger
		 * /api/dashboard:
		 *   get:
		 *     summary: Get dashboard data
		 *     description: |
		 *       Returns aggregated data for the dashboard including:
		 *       - Latest 4 consultations (unread first, then most recent)
		 *       - Count of active properties (not archived)
		 *       - Count of inactive properties (archived)
		 *       - Count of unanswered consultations
		 *     tags: [Dashboard]
		 *     security:
		 *       - bearerAuth: []
		 *     responses:
		 *       200:
		 *         description: Dashboard data retrieved successfully
		 *         content:
		 *           application/json:
		 *             schema:
		 *               type: object
		 *               properties:
		 *                 data:
		 *                   type: object
		 *                   properties:
		 *                     consultations:
		 *                       type: array
		 *                       items:
		 *                         type: object
		 *                         properties:
		 *                           id:
		 *                             type: integer
		 *                             example: 1
		 *                           consultation_date:
		 *                             type: string
		 *                             format: date-time
		 *                             example: "2025-12-10T03:15:00.000Z"
		 *                           is_read:
		 *                             type: boolean
		 *                             example: false
		 *                           message:
		 *                             type: string
		 *                             example: "Consulta sobre propiedad..."
		 *                           consultant_name:
		 *                             type: string
		 *                             nullable: true
		 *                             example: "María González"
		 *                           consultant_email:
		 *                             type: string
		 *                             nullable: true
		 *                             example: "maria.g@email.com"
		 *                           consultant_phone:
		 *                             type: string
		 *                             nullable: true
		 *                             example: "+54 11 4567-8901"
		 *                           property:
		 *                             type: object
		 *                             nullable: true
		 *                             properties:
		 *                               id:
		 *                                 type: integer
		 *                                 example: 24
		 *                               title:
		 *                                 type: string
		 *                                 example: "Departamento Av. Santa Fe 2956 4B"
		 *                     stats:
		 *                       type: object
		 *                       properties:
		 *                         active_properties:
		 *                           type: integer
		 *                           example: 247
		 *                           description: Count of non-archived properties
		 *                         inactive_properties:
		 *                           type: integer
		 *                           example: 120
		 *                           description: Count of archived properties
		 *                         unanswered_consultations:
		 *                           type: integer
		 *                           example: 41
		 *                           description: Count of consultations without response (responded_by_user_id IS NULL)
		 *                         unread_consultations:
		 *                           type: integer
		 *                           example: 10
		 *                           description: Count of unread consultations (is_read = false)
		 *       401:
		 *         description: Unauthorized
		 *       500:
		 *         description: Internal server error
		 */
		router.get('/', authMiddleware.authenticate, (req, res) =>
			controller.getDashboard(req, res),
		);

		return router;
	}
}

