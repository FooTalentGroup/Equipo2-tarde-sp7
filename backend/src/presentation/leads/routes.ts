import { Router } from 'express';
import { LeadController } from './controller';
import { LeadServices } from '../services/lead.services';

export class LeadRoutes {
    static get routes(): Router {
        const router = Router();
        const leadServices = new LeadServices();
        const controller = new LeadController(leadServices);

        // Definir las rutas
        router.post('/', controller.createLead);
        router.get('/', controller.getAllLeads);
        router.get('/property/:propertyId', controller.getLeadsByProperty);
        router.get('/:id', controller.getLead);
        router.put('/:id', controller.updateLead);
        router.delete('/:id', controller.deleteLead);

        return router;
    }
}

