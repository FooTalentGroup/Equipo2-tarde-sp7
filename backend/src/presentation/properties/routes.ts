import { Router } from 'express';
import { PropertyController } from './controller';
import { PropertyServices } from '../services/property.services';
import { CreateFullPropertyController } from './create-full-property.controller';
import { CreateFullPropertyService } from '../services/create-full-property.service';
import { cloudinaryAdapter } from '../../config';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { jwtAdapter } from '../../config';
import { uploadPropertyFile } from '../middlewares/upload.middleware';

export class PropertyRoutes {
    static get routes(): Router {
        const router = Router();
        const propertyServices = new PropertyServices();
        const controller = new PropertyController(propertyServices);
        
        // Servicio y controller para crear propiedad completa
        const createFullPropertyService = new CreateFullPropertyService(cloudinaryAdapter);
        const createFullPropertyController = new CreateFullPropertyController(createFullPropertyService);
        const authMiddleware = new AuthMiddleware(jwtAdapter);

        // Ruta para crear propiedad completa (requiere autenticación y acepta archivos)
        router.post('/full', 
            authMiddleware.authenticate,
            (req, res, next) => {
                uploadPropertyFile(req, res, (err) => {
                    if (err) {
                        // Pasar error de multer al controller
                        (req as any).multerError = err;
                    }
                    next();
                });
            },
            createFullPropertyController.createFullProperty
        );

        // Definir las rutas
        router.post('/', controller.createProperty);
        router.get('/', controller.getAllProperties);
        router.get('/:id', controller.getProperty);
        router.put('/:id', controller.updateProperty);
        router.delete('/:id', controller.deleteProperty);

        // Property Amenities
        router.post('/:id/amenities', controller.addAmenityToProperty);
        router.get('/:id/amenities', controller.getPropertyAmenities);
        router.delete('/:id/amenities/:amenityId', controller.removeAmenityFromProperty);

        // Property Services
        router.post('/:id/services', controller.addServiceToProperty);
        router.get('/:id/services', controller.getPropertyServices);
        router.delete('/:id/services/:serviceId', controller.removeServiceFromProperty);

        return router;
    }

    // Rutas para funciones
    static get functionRoutes(): Router {
        const router = Router();
        
        // Servicio y controller para crear propiedad completa
        const createFullPropertyService = new CreateFullPropertyService(cloudinaryAdapter);
        const createFullPropertyController = new CreateFullPropertyController(createFullPropertyService);
        const authMiddleware = new AuthMiddleware(jwtAdapter);

        // Ruta para crear propiedad completa (requiere autenticación y acepta archivos)
        router.post('/create-full-property', 
            authMiddleware.authenticate,
            (req, res, next) => {
                uploadPropertyFile(req, res, (err) => {
                    if (err) {
                        // Pasar error de multer al controller
                        (req as any).multerError = err;
                    }
                    next();
                });
            },
            createFullPropertyController.createFullProperty
        );

        return router;
    }
}

