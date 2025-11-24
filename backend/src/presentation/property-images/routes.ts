import { Router } from 'express';
import { PropertyImageController } from './controller';
import { PropertyImageServices } from '../services/property-image.services';

export class PropertyImageRoutes {
    static get routes(): Router {
        const router = Router();
        const propertyImageServices = new PropertyImageServices();
        const controller = new PropertyImageController(propertyImageServices);

        // Definir las rutas
        router.post('/', controller.createPropertyImage);
        router.get('/property/:propertyId', controller.getPropertyImages);
        router.get('/:id', controller.getPropertyImage);
        router.put('/:id/primary', controller.setPrimaryImage);
        router.delete('/:id', controller.deletePropertyImage);

        return router;
    }
}

