import { Router } from 'express';
import { Authroutes } from './auth/routes';
import { PropertyRoutes } from './properties/routes';
import { ClientRoutes } from './clients/routes';
import { UserRoutes } from './users/routes';
import { ConsultationRoutes } from './consultations/routes';

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

    // Rutas de consultas (público)
    apiRouter.use('/consultations', ConsultationRoutes.routes);

    // Montar todas las rutas bajo /api
    router.use('/api', apiRouter);

    return router;
  }
}

