import { Router } from 'express';
import { Authroutes } from './auth/routes';
import { PropertyRoutes } from './properties/routes';
import { ClientRoutes } from './clients/routes';
import { UserRoutes } from './users/routes';

export class AppRoutes {
  static get routes(): Router {
    const router = Router();
    
    // Crear router para agrupar todas las rutas bajo /api
    const apiRouter = Router();
    
    // Rutas de autenticación
    apiRouter.use('/auth', Authroutes.routes);

    // Rutas de usuarios
    apiRouter.use('/users', UserRoutes.routes);

    // Rutas de propiedades
    apiRouter.use('/properties', PropertyRoutes.routes);

    // Rutas de clientes
    apiRouter.use('/clients', ClientRoutes.routes);

    // Montar todas las rutas bajo /api
    router.use('/api', apiRouter);

    return router;
  }
}

