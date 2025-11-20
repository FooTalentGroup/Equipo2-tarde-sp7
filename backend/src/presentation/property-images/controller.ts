import { Request, Response } from 'express';
import { CustomError, CreatePropertyImageDto } from '../../domain';
import { PropertyImageServices } from '../services/property-image.services';

export class PropertyImageController {
    constructor(
        private readonly propertyImageServices: PropertyImageServices
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

    createPropertyImage = (req: Request, res: Response) => {
        const [error, createDto] = CreatePropertyImageDto.create(req.body);

        if (error || !createDto) {
            return res.status(400).json({
                message: error || 'Invalid data'
            });
        }

        this.propertyImageServices.createPropertyImage(createDto)
        .then( result => {
            res.status(201).json(result);
        })
        .catch( error => {
            this.handleError(error, res);
        });
    }

    getPropertyImages = (req: Request, res: Response) => {
        const { propertyId } = req.params;

        this.propertyImageServices.getPropertyImages(propertyId)
        .then( result => {
            res.json(result);
        })
        .catch( error => {
            this.handleError(error, res);
        });
    }

    getPropertyImage = (req: Request, res: Response) => {
        const { id } = req.params;

        this.propertyImageServices.getPropertyImageById(id)
        .then( result => {
            res.json(result);
        })
        .catch( error => {
            this.handleError(error, res);
        });
    }

    setPrimaryImage = (req: Request, res: Response) => {
        const { id } = req.params;

        this.propertyImageServices.setPrimaryImage(id)
        .then( result => {
            res.json(result);
        })
        .catch( error => {
            this.handleError(error, res);
        });
    }

    deletePropertyImage = (req: Request, res: Response) => {
        const { id } = req.params;

        this.propertyImageServices.deletePropertyImage(id)
        .then( result => {
            res.json(result);
        })
        .catch( error => {
            this.handleError(error, res);
        });
    }
}

