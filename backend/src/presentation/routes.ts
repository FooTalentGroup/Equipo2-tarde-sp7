import { Router } from 'express';
import { Authroutes } from './auth/routes';
import { ClientRoutes } from './clients/routes';
import { PropertyRoutes } from './properties/routes';
import { PropertyImageRoutes } from './property-images/routes';
import { LeadRoutes } from './leads/routes';
import { AddressRoutes } from './addresses/routes';
import { LocationRoutes } from './location/routes';
import { CatalogRoutes } from './catalogs/routes';
import { ContractRoutes } from './contracts/routes';
import { RentalRoutes } from './rentals/routes';
import { ProfileRoutes } from './profiles/routes';

export class AppRoutes {
  static get routes(): Router {
    const router = Router();
    
    // Rutas de autenticación (sin prefijo /rest/v1)
    router.use('/auth', Authroutes.routes);
    
    // Rutas REST: /rest/v1/...
    router.use('/rest/v1/clients', ClientRoutes.routes);
    router.use('/rest/v1/properties', PropertyRoutes.routes);
    router.use('/rest/v1/property-images', PropertyImageRoutes.routes);
    router.use('/rest/v1/leads', LeadRoutes.routes);
    router.use('/rest/v1/addresses', AddressRoutes.routes);
    router.use('/rest/v1/contracts', ContractRoutes.routes);
    router.use('/rest/v1/rentals', RentalRoutes.routes);
    router.use('/rest/v1/profiles', ProfileRoutes.routes);
    router.use('/rest/v1', LocationRoutes.routes); // Location CRUD completo: /rest/v1/countries, /rest/v1/cities, /rest/v1/departments
    router.use('/rest/v1', CatalogRoutes.routes); // Catálogos CRUD completo: /rest/v1/property-types, etc.
    
    // Funciones: /functions/v1/...
    router.use('/functions/v1', PropertyRoutes.functionRoutes); // /functions/v1/create-full-property

    return router;
  }
}

