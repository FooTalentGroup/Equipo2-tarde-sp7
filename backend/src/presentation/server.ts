import express, { Router } from 'express';
import path from 'path';
import { PostgresDatabase } from '../data/postgres/database';

interface Options {
  port: number;
  routes: Router;
  public_path?: string;
}


export class Server {

  public readonly app = express();
  private serverListener?: any;
  private readonly port: number;
  private readonly publicPath: string;
  private readonly routes: Router;

  constructor(options: Options) {
    const { port, routes, public_path = 'public' } = options;
    this.port = port;
    this.publicPath = public_path;
    this.routes = routes;
  }

  
  
  async start() {
    //* Middlewares globales
    this.app.use( express.json() ); // raw
    this.app.use( express.urlencoded({ extended: true }) ); // x-www-form-urlencoded

    //* CORS (configurar según necesidades)
    const { CorsMiddleware } = await import('./middlewares/cors.middleware');
    this.app.use(CorsMiddleware.configure(['*'])); // Permitir todos los orígenes en desarrollo

    //* Public Folder
    this.app.use( express.static( this.publicPath ) );

    //* Swagger Documentation
    const { swaggerSpec, generateSwaggerSpec } = await import('../config/swagger');
    const swaggerUi = await import('swagger-ui-express');
    
    // Opciones personalizadas para Swagger UI
    const swaggerUiOptions = {
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: "RedProp API Documentation",
      swaggerOptions: {
        persistAuthorization: true, // Persiste el token entre recargas de página
        displayRequestDuration: true, // Muestra el tiempo de respuesta
        filter: true, // Habilita el filtro de endpoints
        tryItOutEnabled: true, // Habilita "Try it out" por defecto
        docExpansion: 'list', // Expande solo los tags, no los endpoints
      },
    };
    
    // Setup Swagger UI con detección automática del servidor basado en el request
    const swaggerSetup = (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const dynamicSpec = generateSwaggerSpec(req);
      return swaggerUi.setup(dynamicSpec, swaggerUiOptions)(req, res, next);
    };
    
    // Setup Swagger UI at both /docs and /api-docs
    this.app.use('/docs', swaggerUi.serve, swaggerSetup);
    this.app.use('/api-docs', swaggerUi.serve, swaggerSetup);

    //* Routes
    this.app.use( this.routes );

    //* Error Handler (debe ir al final, después de todas las rutas)
    const { ErrorHandlerMiddleware } = await import('./middlewares/error-handler.middleware');
    this.app.use(ErrorHandlerMiddleware.handle);

    //* SPA /^\/(?!api).*/  <== Únicamente si no empieza con la palabra api
    // Exclude /docs, /api-docs, and /api routes from SPA routing
    this.app.get('*', (req, res, next) => {
      // Skip SPA routing for Swagger docs and API routes
      if (req.path.startsWith('/docs') || req.path.startsWith('/api-docs') || req.path.startsWith('/api')) {
        return next();
      }
      const indexPath = path.join( __dirname + `../../../${ this.publicPath }/index.html` );
      res.sendFile(indexPath);
    });
    

    this.serverListener = this.app.listen(this.port, () => {
      console.log(`Server running on port ${ this.port }`);
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
