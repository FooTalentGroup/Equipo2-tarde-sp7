import { Router } from "express";

import { cloudinaryAdapter, jwtAdapter } from "../../config";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { UploadMiddleware } from "../middlewares/upload.middleware";
import { CompanyServices } from "../services/company.services";
import { CompanyController } from "./controller";

export class CompanyRoutes {
	static get routes(): Router {
		const router = Router();

		// Initialize dependencies using imported adapters
		const companyServices = new CompanyServices(cloudinaryAdapter);
		const controller = new CompanyController(companyServices);
		const authMiddleware = new AuthMiddleware(jwtAdapter);

		/**
		 * @swagger
		 * /api/company/settings:
		 *   get:
		 *     summary: Get company settings (logo, name)
		 *     description: Public endpoint to retrieve company configuration. Used to display logo in login page, admin panel, and agent panel.
		 *     tags: [Company]
		 *     responses:
		 *       200:
		 *         description: Company settings retrieved successfully
		 *         content:
		 *           application/json:
		 *             schema:
		 *               type: object
		 *               properties:
		 *                 logo_url:
		 *                   type: string
		 *                   nullable: true
		 *                   description: URL of company logo in Cloudinary
		 *                   example: https://res.cloudinary.com/xxx/image/upload/v123/company/logo.png
		 *                 company_name:
		 *                   type: string
		 *                   description: Name of the real estate company
		 *                   example: Inmobiliaria
		 *       500:
		 *         description: Internal server error
		 */
		router.get("/settings", (req, res) => controller.getSettings(req, res));

		/**
		 * @swagger
		 * /api/company/logo:
		 *   patch:
		 *     summary: Update company logo (Admin only)
		 *     description: |
		 *       Upload a new company logo. Only administrators can update the logo.
		 *       The logo will be displayed in the admin panel and agent panel.
		 *       Previous logo will be automatically deleted from Cloudinary.
		 *     tags: [Company]
		 *     security:
		 *       - bearerAuth: []
		 *     requestBody:
		 *       required: true
		 *       content:
		 *         multipart/form-data:
		 *           schema:
		 *             type: object
		 *             required:
		 *               - logo
		 *             properties:
		 *               logo:
		 *                 type: string
		 *                 format: binary
		 *                 description: Logo image file (JPG or PNG, max 2MB)
		 *     responses:
		 *       200:
		 *         description: Logo updated successfully
		 *         content:
		 *           application/json:
		 *             schema:
		 *               type: object
		 *               properties:
		 *                 message:
		 *                   type: string
		 *                   example: Logo actualizado exitosamente
		 *                 logo_url:
		 *                   type: string
		 *                   example: https://res.cloudinary.com/xxx/image/upload/v123/company/logo.png
		 *                 company_name:
		 *                   type: string
		 *                   example: Inmobiliaria
		 *       400:
		 *         description: Bad request (invalid file format or missing file)
		 *         content:
		 *           application/json:
		 *             schema:
		 *               type: object
		 *               properties:
		 *                 message:
		 *                   type: string
		 *                   example: Invalid file format. Only JPG and PNG are allowed
		 *       401:
		 *         description: Unauthorized (no token or invalid token)
		 *       403:
		 *         description: Forbidden (user is not admin)
		 *       413:
		 *         description: File too large (max 2MB)
		 *       500:
		 *         description: Internal server error
		 */
		router.patch(
			"/logo",
			authMiddleware.authenticate,
			authMiddleware.requireAdmin,
			UploadMiddleware.single("logo", 2 * 1024 * 1024), // 2MB max
			(req, res) => controller.updateLogo(req, res),
		);

		return router;
	}
}
