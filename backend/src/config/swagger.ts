import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RedProp API',
      version: '0.0.1',
      description: 'API documentation for Redprop',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Local server',
      },
    ],
  },
  apis: ['./src/presentation/**/routes.ts'], // Path to the API docs
};

export const swaggerSpec = swaggerJSDoc(options);
