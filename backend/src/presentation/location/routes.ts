import { Router } from 'express';
import { LocationController } from './controller';
import { LocationServices } from '../services/location.services';

export class LocationRoutes {
    static get routes(): Router {
        const router = Router();
        const locationServices = new LocationServices();
        const controller = new LocationController(locationServices);

        // Countries
        router.post('/countries', controller.createCountry);
        router.get('/countries', controller.getAllCountries);
        router.get('/countries/:id', controller.getCountry);
        router.put('/countries/:id', controller.updateCountry);
        router.delete('/countries/:id', controller.deleteCountry);
        router.get('/countries/:countryId/cities', controller.getCitiesByCountry);

        // Cities
        router.post('/cities', controller.createCity);
        router.get('/cities', controller.getAllCities);
        router.get('/cities/:id', controller.getCity);
        router.put('/cities/:id', controller.updateCity);
        router.delete('/cities/:id', controller.deleteCity);
        router.get('/cities/:cityId/departments', controller.getDepartmentsByCity);

        // Departments
        router.post('/departments', controller.createDepartment);
        router.get('/departments', controller.getAllDepartments);
        router.get('/departments/:id', controller.getDepartment);
        router.put('/departments/:id', controller.updateDepartment);
        router.delete('/departments/:id', controller.deleteDepartment);

        return router;
    }
}

