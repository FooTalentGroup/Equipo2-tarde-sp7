import type { Request, Response } from 'express';
import { ErrorHandlerUtil } from '../shared/error-handler.util';
import type { DashboardServices } from '../services/dashboard.services';

export class DashboardController {
	constructor(private readonly dashboardServices: DashboardServices) {}

	
	getDashboard = async (req: Request, res: Response) => {
		try {
			const result = await this.dashboardServices.getDashboardData();

			return res.status(200).json({
				data: result,
			});
		} catch (error) {
			ErrorHandlerUtil.handleError(error, res, 'Dashboard');
		}
	};
}

