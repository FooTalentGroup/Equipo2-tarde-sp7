import { Router } from "express";

import { Authroutes } from "./auth/routes";
import { ClientRoutes } from "./clients/routes";
import { CompanyRoutes } from "./company/routes";
import { ConsultationRoutes } from "./consultations/routes";
import { DashboardRoutes } from "./dashboard/routes";
import { PropertyRoutes } from "./properties/routes";
import { UserRoutes } from "./users/routes";

export class AppRoutes {
	static get routes(): Router {
		const router = Router();

		const apiRouter = Router();

		apiRouter.use("/auth", Authroutes.routes);
		apiRouter.use("/users", UserRoutes.routes);
		apiRouter.use("/properties", PropertyRoutes.routes);
		apiRouter.use("/clients", ClientRoutes.routes);
		apiRouter.use("/consultations", ConsultationRoutes.routes);
		apiRouter.use("/dashboard", DashboardRoutes.routes);
		apiRouter.use("/company", CompanyRoutes.routes);

		router.use("/api", apiRouter);

		return router;
	}
}

