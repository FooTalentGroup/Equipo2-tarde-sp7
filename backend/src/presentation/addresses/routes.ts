import { Router } from 'express';
import { AddressController } from './controller';
import { AddressServices } from '../services/address.services';

export class AddressRoutes {
    static get routes(): Router {
        const router = Router();
        const addressServices = new AddressServices();
        const controller = new AddressController(addressServices);

        // Definir las rutas
        router.post('/', controller.createAddress);
        router.get('/', controller.getAllAddresses);
        router.get('/department/:departmentId', controller.getAddressesByDepartment);
        router.get('/:id', controller.getAddress);
        router.put('/:id', controller.updateAddress);
        router.delete('/:id', controller.deleteAddress);

        return router;
    }
}

