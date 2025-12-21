import swaggerJSDoc from "swagger-jsdoc";
import { Request } from "express";
import { envs } from "./envs";


function detectServerUrl(req: Request): string {
  const protocol = req.get('x-forwarded-proto') || req.protocol || 'http';
  
  const host = req.get('x-forwarded-host') || req.get('host') || `localhost:${envs.PORT}`;
  
  return `${protocol}://${host}`;
}


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

  if (req && baseOptions.definition) {
    const detectedUrl = detectServerUrl(req);
    const isLocal = detectedUrl.includes('localhost') || detectedUrl.includes('127.0.0.1');
    
    const existingUrls = baseOptions.definition.servers?.map((s: { url: string }) => s.url) || [];
    if (!existingUrls.includes(detectedUrl)) {
      if (baseOptions.definition.servers) {
        baseOptions.definition.servers.unshift({
          url: detectedUrl,
          description: isLocal ? "Current server (Local)" : "Current server (Production)",
        });
      }
    } else {
      if (baseOptions.definition.servers) {
        const serverIndex = baseOptions.definition.servers.findIndex((s: { url: string }) => s.url === detectedUrl);
        if (serverIndex > 0) {
          const server = baseOptions.definition.servers.splice(serverIndex, 1)[0];
          baseOptions.definition.servers.unshift(server);
        }
      }
    }
  }

  return swaggerJSDoc(baseOptions);
}

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
    apis: ["./src/presentation/**/routes.ts"],
  };

export const swaggerSpec = swaggerJSDoc(options);
export { generateSwaggerSpec };
