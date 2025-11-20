import { Router } from 'express';
import { CatalogController } from './controller';
import { CatalogServices } from '../services/catalog.services';

export class CatalogRoutes {
    static get routes(): Router {
        const router = Router();
        const catalogServices = new CatalogServices();
        const controller = new CatalogController(catalogServices);

        // Countries
        router.get('/countries', controller.getAllCountries);
        router.get('/countries/:id', controller.getCountry);
        router.get('/countries/:countryId/cities', controller.getCitiesByCountry);

        // Cities
        router.get('/cities/:id', controller.getCity);
        router.get('/cities/:cityId/departments', controller.getDepartmentsByCity);

        // Departments
        router.get('/departments/:id', controller.getDepartment);

        // Property Types
        router.post('/property-types', controller.createPropertyType);
        router.get('/property-types', controller.getAllPropertyTypes);
        router.get('/property-types/:id', controller.getPropertyType);
        router.put('/property-types/:id', controller.updatePropertyType);
        router.delete('/property-types/:id', controller.deletePropertyType);

        // Property Status
        router.post('/property-status', controller.createPropertyStatus);
        router.get('/property-status', controller.getAllPropertyStatus);
        router.get('/property-status/:id', controller.getPropertyStatus);
        router.put('/property-status/:id', controller.updatePropertyStatus);
        router.delete('/property-status/:id', controller.deletePropertyStatus);

        // Operation Types
        router.post('/operation-types', controller.createOperationType);
        router.get('/operation-types', controller.getAllOperationTypes);
        router.get('/operation-types/:id', controller.getOperationType);
        router.put('/operation-types/:id', controller.updateOperationType);
        router.delete('/operation-types/:id', controller.deleteOperationType);

        // Amenities
        router.post('/amenities', controller.createAmenity);
        router.get('/amenities', controller.getAllAmenities);
        router.get('/amenities/:id', controller.getAmenity);
        router.put('/amenities/:id', controller.updateAmenity);
        router.delete('/amenities/:id', controller.deleteAmenity);

        // Services
        router.post('/services', controller.createService);
        router.get('/services', controller.getAllServices);
        router.get('/services/:id', controller.getService);
        router.put('/services/:id', controller.updateService);
        router.delete('/services/:id', controller.deleteService);

        // Lead Status
        router.post('/lead-status', controller.createLeadStatus);
        router.get('/lead-status', controller.getAllLeadStatus);
        router.get('/lead-status/:id', controller.getLeadStatus);
        router.put('/lead-status/:id', controller.updateLeadStatus);
        router.delete('/lead-status/:id', controller.deleteLeadStatus);

        // Roles
        router.post('/roles', controller.createRole);
        router.get('/roles', controller.getAllRoles);
        router.get('/roles/:id', controller.getRole);
        router.put('/roles/:id', controller.updateRole);
        router.delete('/roles/:id', controller.deleteRole);

        return router;
    }
}

