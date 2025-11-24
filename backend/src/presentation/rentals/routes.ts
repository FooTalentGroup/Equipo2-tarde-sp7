import { Router } from 'express';
import { RentalController } from './controller';
import { RentalServices } from '../services/rental.services';

export class RentalRoutes {
    static get routes(): Router {
        const router = Router();
        const rentalServices = new RentalServices();
        const controller = new RentalController(rentalServices);

        router.post('/', controller.createRental);
        router.get('/', controller.getAllRentals);
        router.get('/property/:propertyId', controller.getRentalsByProperty);
        router.get('/client/:clientId', controller.getRentalsByClient);
        router.get('/:id', controller.getRental);
        router.put('/:id', controller.updateRental);
        router.delete('/:id', controller.deleteRental);

        return router;
    }
}

