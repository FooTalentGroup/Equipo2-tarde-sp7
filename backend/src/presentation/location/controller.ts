import { Request, Response } from 'express';
import { CustomError, CreateCatalogDto, UpdateCatalogDto, CreateCityDto, UpdateCityDto, CreateDepartmentDto, UpdateDepartmentDto } from '../../domain';
import { LocationServices } from '../services/location.services';

export class LocationController {
    constructor(
        private readonly locationServices: LocationServices
    ){}

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({
                message: error.message
            });
        }
        console.log(`error: ${error}`);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }

    // Countries
    createCountry = (req: Request, res: Response) => {
        const [error, createDto] = CreateCatalogDto.create(req.body);
        if (error || !createDto) {
            return res.status(400).json({ message: error || 'Invalid data' });
        }
        this.locationServices.createCountry(createDto)
        .then( result => res.status(201).json(result))
        .catch( error => this.handleError(error, res));
    }

    getAllCountries = (req: Request, res: Response) => {
        this.locationServices.getAllCountries()
        .then( result => res.json(result))
        .catch( error => this.handleError(error, res));
    }

    getCountry = (req: Request, res: Response) => {
        const { id } = req.params;
        this.locationServices.getCountryById(id)
        .then( result => res.json(result))
        .catch( error => this.handleError(error, res));
    }

    updateCountry = (req: Request, res: Response) => {
        const { id } = req.params;
        const [error, updateDto] = UpdateCatalogDto.create(req.body);
        if (error || !updateDto) {
            return res.status(400).json({ message: error || 'Invalid data' });
        }
        this.locationServices.updateCountry(id, updateDto)
        .then( result => res.json(result))
        .catch( error => this.handleError(error, res));
    }

    deleteCountry = (req: Request, res: Response) => {
        const { id } = req.params;
        this.locationServices.deleteCountry(id)
        .then( result => res.json(result))
        .catch( error => this.handleError(error, res));
    }

    // Cities
    createCity = (req: Request, res: Response) => {
        const [error, createDto] = CreateCityDto.create(req.body);
        if (error || !createDto) {
            return res.status(400).json({ message: error || 'Invalid data' });
        }
        this.locationServices.createCity(createDto)
        .then( result => res.status(201).json(result))
        .catch( error => this.handleError(error, res));
    }

    getAllCities = (req: Request, res: Response) => {
        this.locationServices.getAllCities()
        .then( result => res.json(result))
        .catch( error => this.handleError(error, res));
    }

    getCitiesByCountry = (req: Request, res: Response) => {
        const { countryId } = req.params;
        this.locationServices.getCitiesByCountry(countryId)
        .then( result => res.json(result))
        .catch( error => this.handleError(error, res));
    }

    getCity = (req: Request, res: Response) => {
        const { id } = req.params;
        this.locationServices.getCityById(id)
        .then( result => res.json(result))
        .catch( error => this.handleError(error, res));
    }

    updateCity = (req: Request, res: Response) => {
        const { id } = req.params;
        const [error, updateDto] = UpdateCityDto.create(req.body);
        if (error || !updateDto) {
            return res.status(400).json({ message: error || 'Invalid data' });
        }
        this.locationServices.updateCity(id, updateDto)
        .then( result => res.json(result))
        .catch( error => this.handleError(error, res));
    }

    deleteCity = (req: Request, res: Response) => {
        const { id } = req.params;
        this.locationServices.deleteCity(id)
        .then( result => res.json(result))
        .catch( error => this.handleError(error, res));
    }

    // Departments
    createDepartment = (req: Request, res: Response) => {
        const [error, createDto] = CreateDepartmentDto.create(req.body);
        if (error || !createDto) {
            return res.status(400).json({ message: error || 'Invalid data' });
        }
        this.locationServices.createDepartment(createDto)
        .then( result => res.status(201).json(result))
        .catch( error => this.handleError(error, res));
    }

    getAllDepartments = (req: Request, res: Response) => {
        this.locationServices.getAllDepartments()
        .then( result => res.json(result))
        .catch( error => this.handleError(error, res));
    }

    getDepartmentsByCity = (req: Request, res: Response) => {
        const { cityId } = req.params;
        this.locationServices.getDepartmentsByCity(cityId)
        .then( result => res.json(result))
        .catch( error => this.handleError(error, res));
    }

    getDepartment = (req: Request, res: Response) => {
        const { id } = req.params;
        this.locationServices.getDepartmentById(id)
        .then( result => res.json(result))
        .catch( error => this.handleError(error, res));
    }

    updateDepartment = (req: Request, res: Response) => {
        const { id } = req.params;
        const [error, updateDto] = UpdateDepartmentDto.create(req.body);
        if (error || !updateDto) {
            return res.status(400).json({ message: error || 'Invalid data' });
        }
        this.locationServices.updateDepartment(id, updateDto)
        .then( result => res.json(result))
        .catch( error => this.handleError(error, res));
    }

    deleteDepartment = (req: Request, res: Response) => {
        const { id } = req.params;
        this.locationServices.deleteDepartment(id)
        .then( result => res.json(result))
        .catch( error => this.handleError(error, res));
    }
}

