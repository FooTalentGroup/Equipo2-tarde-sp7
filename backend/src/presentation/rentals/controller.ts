import { Request, Response } from 'express';
import { CustomError, CreateRentalDto, UpdateRentalDto } from '../../domain';
import { RentalServices } from '../services/rental.services';

export class RentalController {
    constructor(
        private readonly rentalServices: RentalServices
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

    createRental = (req: Request, res: Response) => {
        const [error, createDto] = CreateRentalDto.create(req.body);
        if (error || !createDto) {
            return res.status(400).json({ message: error || 'Invalid data' });
        }
        this.rentalServices.createRental(createDto)
        .then( result => res.status(201).json(result))
        .catch( error => this.handleError(error, res));
    }

    getRental = (req: Request, res: Response) => {
        const { id } = req.params;
        this.rentalServices.getRentalById(id)
        .then( result => res.json(result))
        .catch( error => this.handleError(error, res));
    }

    getAllRentals = (req: Request, res: Response) => {
        this.rentalServices.getAllRentals()
        .then( result => res.json(result))
        .catch( error => this.handleError(error, res));
    }

    getRentalsByProperty = (req: Request, res: Response) => {
        const { propertyId } = req.params;
        this.rentalServices.getRentalsByProperty(propertyId)
        .then( result => res.json(result))
        .catch( error => this.handleError(error, res));
    }

    getRentalsByClient = (req: Request, res: Response) => {
        const { clientId } = req.params;
        this.rentalServices.getRentalsByClient(clientId)
        .then( result => res.json(result))
        .catch( error => this.handleError(error, res));
    }

    updateRental = (req: Request, res: Response) => {
        const { id } = req.params;
        const [error, updateDto] = UpdateRentalDto.create(req.body);
        if (error || !updateDto) {
            return res.status(400).json({ message: error || 'Invalid data' });
        }
        this.rentalServices.updateRental(id, updateDto)
        .then( result => res.json(result))
        .catch( error => this.handleError(error, res));
    }

    deleteRental = (req: Request, res: Response) => {
        const { id } = req.params;
        this.rentalServices.deleteRental(id)
        .then( result => res.json(result))
        .catch( error => this.handleError(error, res));
    }
}

