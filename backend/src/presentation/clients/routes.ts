import { Router } from 'express';
import { ClientController } from './controller';
import { ClientServices } from '../services/client.services';

export class ClientRoutes {
    static get routes(): Router {
        const router = Router();
        const clientServices = new ClientServices();
        const controller = new ClientController(clientServices);

        // Definir las rutas
        router.post('/', controller.createClient);
        router.get('/', controller.getAllClients);
        router.get('/:id', controller.getClient);
        router.put('/:id', controller.updateClient);
        router.delete('/:id', controller.deleteClient);

        return router;
    }
}

