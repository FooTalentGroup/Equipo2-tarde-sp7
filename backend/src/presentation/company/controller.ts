import type { Request, Response } from "express";

import { CustomError } from "../../domain";
import type { CompanyServices } from "../services/company.services";

export class CompanyController {
	constructor(private readonly companyServices: CompanyServices) {}

	/**
	 * Get company settings (public endpoint)
	 * GET /api/company/settings
	 */
	getSettings = async (req: Request, res: Response) => {
		try {
			const settings = await this.companyServices.getCompanySettings();
			return res.json(settings);
		} catch (error) {
			this.handleError(error, res);
		}
	};

	/**
	 * Update company logo (admin only)
	 * PATCH /api/company/logo
	 */
	updateLogo = async (req: Request, res: Response) => {
		try {
			const logoFile = req.file;
			const user = (req as any).user;

			if (!logoFile) {
				return res.status(400).json({
					message: "Logo file is required",
				});
			}

			if (!user || !user.id) {
				return res.status(401).json({
					message: "User not authenticated",
				});
			}

			const userId =
				typeof user.id === "string" ? parseInt(user.id, 10) : user.id;

			const result = await this.companyServices.updateCompanyLogo(
				logoFile,
				userId,
			);
			return res.json(result);
		} catch (error) {
			this.handleError(error, res);
		}
	};

	/**
	 * Centralized error handler
	 */
	private handleError(error: unknown, res: Response) {
		if (error instanceof CustomError) {
			return res.status(error.statusCode).json({
				message: error.message,
			});
		}

		console.error("Unexpected error:", error);
		return res.status(500).json({
			message: "Internal server error",
		});
	}
}
