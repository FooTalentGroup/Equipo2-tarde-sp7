import type { Request } from "express";
import swaggerJSDoc from "swagger-jsdoc";

import { envs } from "./envs";

/**
 * Detecta automáticamente la URL del servidor basándose en el request
 * Maneja proxies reversos (como Render) usando headers X-Forwarded-*
 */
function detectServerUrl(req: Request): string {
	// Detectar protocolo: considerar X-Forwarded-Proto para proxies (producción)
	const protocol = req.get("x-forwarded-proto") || req.protocol || "http";

	// Detectar host: considerar X-Forwarded-Host para proxies
	const host =
		req.get("x-forwarded-host") || req.get("host") || `localhost:${envs.PORT}`;

	// Construir URL completa
	return `${protocol}://${host}`;
}

/**
 * Genera la configuración de Swagger con detección automática del servidor
 */
function generateSwaggerSpec(req?: Request) {
	const baseOptions: swaggerJSDoc.Options = {
		definition: {
			openapi: "3.0.0",
			info: {
				title: "RedProp API",
				version: "0.0.1",
				description: "API documentation for Redprop",
			},
			tags: [
				{
					name: "Auth",
					description: "Authentication endpoints",
				},
				{
					name: "Users",
					description: "User management endpoints",
				},
				{
					name: "Properties",
					description: "Property management endpoints",
				},
				{
					name: "Clients",
					description: "Client management endpoints (tenants, owners, leads)",
				},
				{
					name: "Consultations",
					description: "Property consultation endpoints (public access)",
				},
			],
			components: {
				securitySchemes: {
					bearerAuth: {
						type: "http",
						scheme: "bearer",
						bearerFormat: "JWT",
						description: "Enter JWT token obtained from /api/auth/login",
					},
				},
			},
			servers: [
				{
					url: "http://localhost:3000",
					description: "Local development server",
				},
				{
					url: "https://realestate-app-zdmk.onrender.com",
					description: "Production server",
				},
			],
		},
		apis: ["./src/presentation/**/routes.ts"], // Path to the API docs
	};

	// Si hay un request, detectar automáticamente y agregar el servidor detectado
	if (req && baseOptions.definition) {
		const detectedUrl = detectServerUrl(req);
		const isLocal =
			detectedUrl.includes("localhost") || detectedUrl.includes("127.0.0.1");

		// Agregar el servidor detectado como el primero (seleccionado por defecto)
		// Evitar duplicados
		const existingUrls =
			baseOptions.definition.servers?.map((s: { url: string }) => s.url) || [];
		if (!existingUrls.includes(detectedUrl)) {
			if (baseOptions.definition.servers) {
				baseOptions.definition.servers.unshift({
					url: detectedUrl,
					description: isLocal
						? "Current server (Local)"
						: "Current server (Production)",
				});
			}
		} else {
			// Si ya existe, moverlo al principio
			if (baseOptions.definition.servers) {
				const serverIndex = baseOptions.definition.servers.findIndex(
					(s: { url: string }) => s.url === detectedUrl,
				);
				if (serverIndex > 0) {
					const server = baseOptions.definition.servers.splice(
						serverIndex,
						1,
					)[0];
					baseOptions.definition.servers.unshift(server);
				}
			}
		}
	}

	return swaggerJSDoc(baseOptions);
}

// Configuración base (sin request) - para compatibilidad
const options: swaggerJSDoc.Options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "RedProp API",
			version: "0.0.1",
			description: "API documentation for Redprop",
		},
		tags: [
			{
				name: "Auth",
				description: "Authentication endpoints",
			},
			{
				name: "Users",
				description: "User management endpoints",
			},
			{
				name: "Properties",
				description: "Property management endpoints",
			},
			{
				name: "Clients",
				description: "Client management endpoints (tenants, owners, leads)",
			},
			{
				name: "Consultations",
				description: "Property consultation endpoints (public access)",
			},
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
					description: "Enter JWT token obtained from /api/auth/login",
				},
			},
		},
		servers: [
			{
				url: "http://localhost:3000",
				description: "Local development server",
			},
			{
				url: "https://realestate-app-zdmk.onrender.com",
				description: "Production server",
			},
		],
	},
	apis: ["./src/presentation/**/routes.ts"], // Path to the API docs
};

export const swaggerSpec = swaggerJSDoc(options);

// Exportar función para generar spec dinámico basado en request
export { generateSwaggerSpec };
