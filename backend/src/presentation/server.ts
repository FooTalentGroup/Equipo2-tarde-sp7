import express, { type Router } from "express";
import type { Server as HttpServer } from "http";
import path from "path";

import { PostgresDatabase } from "../data/postgres/database";

interface Options {
	port: number;
	routes: Router;
	public_path?: string;
}

export class Server {
	public readonly app = express();
	private serverListener?: HttpServer;
	private readonly port: number;
	private readonly publicPath: string;
	private readonly routes: Router;

	constructor(options: Options) {
		const { port, routes, public_path = "public" } = options;
		this.port = port;
		this.publicPath = public_path;
		this.routes = routes;
	}

	async start() {
		this.app.use(express.json()); 
		this.app.use(express.urlencoded({ extended: true }));
		this.app.disable("x-powered-by"); 

		const { CorsMiddleware } = await import("./middlewares/cors.middleware");
		this.app.use(CorsMiddleware.configure(["*"])); 

		this.app.use(express.static(this.publicPath));

		const { swaggerSpec, generateSwaggerSpec } = await import(
			"../config/swagger"
		);
		const swaggerUi = await import("swagger-ui-express");

		const swaggerUiOptions = {
			customCss: ".swagger-ui .topbar { display: none }",
			customSiteTitle: "RedProp API Documentation",
			swaggerOptions: {
				persistAuthorization: true,
				displayRequestDuration: true,
				filter: true, 
				tryItOutEnabled: true,
				docExpansion: "list", 
			},
		};

		const swaggerSetup = (
			req: express.Request,
			res: express.Response,
			next: express.NextFunction,
		) => {
			const dynamicSpec = generateSwaggerSpec(req);
			return swaggerUi.setup(dynamicSpec, swaggerUiOptions)(req, res, next);
		};

		this.app.use("/docs", swaggerUi.serve, swaggerSetup);
		this.app.use("/api-docs", swaggerUi.serve, swaggerSetup);

		this.app.get("/health", (req, res) => {
			res.status(200).json({
				status: "ok",
				timestamp: new Date().toISOString(),
				uptime: process.uptime(),
				service: "Real Estate API",
			});
		});

		this.app.use(this.routes);

		const { ErrorHandlerMiddleware } = await import(
			"./middlewares/error-handler.middleware"
		);
		this.app.use(ErrorHandlerMiddleware.handle);

		this.app.get("*", (req, res, next) => {
			if (
				req.path.startsWith("/docs") ||
				req.path.startsWith("/api-docs") ||
				req.path.startsWith("/api")
			) {
				return next();
			}
			const indexPath = path.join(
				__dirname + `../../../${this.publicPath}/index.html`,
			);
			res.sendFile(indexPath);
		});

		this.serverListener = this.app.listen(this.port, () => {
			console.log(`Server running on port ${this.port}`);
		});
	}

	public async close() {
		return new Promise<void>((resolve) => {
			if (this.serverListener) {
				this.serverListener.close(async () => {
					await PostgresDatabase.disconnect();
					resolve();
				});
			} else {
				PostgresDatabase.disconnect().then(() => resolve());
			}
		});
	}
}
