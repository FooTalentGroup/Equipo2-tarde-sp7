import { Request, Response } from 'express';
import { CustomError, CreatePropertyDto, UpdatePropertyDto, QueryPropertyDto, AddAmenityDto, AddServiceDto } from '../../domain';
import { PropertyServices } from '../services/property.services';

export class PropertyController {
    constructor(
        private readonly propertyServices: PropertyServices
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

    createProperty = (req: Request, res: Response) => {
        const [error, createDto] = CreatePropertyDto.create(req.body);

        if (error || !createDto) {
            return res.status(400).json({
                message: error || 'Invalid data'
            });
        }

        this.propertyServices.createProperty(createDto)
        .then( result => {
            res.status(201).json(result);
        })
        .catch( error => {
            this.handleError(error, res);
        });
    }

    getProperty = (req: Request, res: Response) => {
        const { id } = req.params;

        this.propertyServices.getPropertyById(id)
        .then( result => {
            res.json(result);
        })
        .catch( error => {
            this.handleError(error, res);
        });
    }

    getAllProperties = (req: Request, res: Response) => {
        const [error, queryDto] = QueryPropertyDto.create(req.query);

        if (error) {
            return res.status(400).json({
                message: error
            });
        }

        this.propertyServices.getAllProperties(queryDto)
        .then( result => {
            res.json(result);
        })
        .catch( error => {
            this.handleError(error, res);
        });
    }

    updateProperty = (req: Request, res: Response) => {
        const { id } = req.params;
        const [error, updateDto] = UpdatePropertyDto.create(req.body);

        if (error || !updateDto) {
            return res.status(400).json({
                message: error || 'Invalid data'
            });
        }

        this.propertyServices.updateProperty(id, updateDto)
        .then( result => {
            res.json(result);
        })
        .catch( error => {
            this.handleError(error, res);
        });
    }

    deleteProperty = (req: Request, res: Response) => {
        const { id } = req.params;

        this.propertyServices.deleteProperty(id)
        .then( result => {
            res.json(result);
        })
        .catch( error => {
            this.handleError(error, res);
        });
    }

    // Property Amenities
    addAmenityToProperty = (req: Request, res: Response) => {
        const { id } = req.params;
        const [error, addDto] = AddAmenityDto.create(req.body);
        if (error || !addDto) {
            return res.status(400).json({ message: error || 'Invalid data' });
        }
        this.propertyServices.addAmenityToProperty(id, addDto)
        .then( result => res.status(201).json(result))
        .catch( error => this.handleError(error, res));
    }

    removeAmenityFromProperty = (req: Request, res: Response) => {
        const { id, amenityId } = req.params;
        this.propertyServices.removeAmenityFromProperty(id, amenityId)
        .then( result => res.json(result))
        .catch( error => this.handleError(error, res));
    }

    getPropertyAmenities = (req: Request, res: Response) => {
        const { id } = req.params;
        this.propertyServices.getPropertyAmenities(id)
        .then( result => res.json(result))
        .catch( error => this.handleError(error, res));
    }

    // Property Services
    addServiceToProperty = (req: Request, res: Response) => {
        const { id } = req.params;
        const [error, addDto] = AddServiceDto.create(req.body);
        if (error || !addDto) {
            return res.status(400).json({ message: error || 'Invalid data' });
        }
        this.propertyServices.addServiceToProperty(id, addDto)
        .then( result => res.status(201).json(result))
        .catch( error => this.handleError(error, res));
    }

    removeServiceFromProperty = (req: Request, res: Response) => {
        const { id, serviceId } = req.params;
        this.propertyServices.removeServiceFromProperty(id, serviceId)
        .then( result => res.json(result))
        .catch( error => this.handleError(error, res));
    }

    getPropertyServices = (req: Request, res: Response) => {
        const { id } = req.params;
        this.propertyServices.getPropertyServices(id)
        .then( result => res.json(result))
        .catch( error => this.handleError(error, res));
    }
}

