import { Router } from 'express';
import { ContractController } from './controller';
import { ContractServices } from '../services/contract.services';

export class ContractRoutes {
    static get routes(): Router {
        const router = Router();
        const contractServices = new ContractServices();
        const controller = new ContractController(contractServices);

        router.post('/', controller.createContract);
        router.get('/', controller.getAllContracts);
        router.get('/property/:propertyId', controller.getContractsByProperty);
        router.get('/client/:clientId', controller.getContractsByClient);
        router.get('/:id', controller.getContract);
        router.put('/:id', controller.updateContract);
        router.delete('/:id', controller.deleteContract);

        return router;
    }
}

