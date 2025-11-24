import { Request, Response } from 'express';
import { CustomError, CreateClientDto, UpdateClientDto } from '../../domain';
import { ClientServices } from '../services/client.services';

export class ClientController {
    constructor(
        private readonly clientServices: ClientServices
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

    createClient = (req: Request, res: Response) => {
        const [error, createDto] = CreateClientDto.create(req.body);

        if (error || !createDto) {
            return res.status(400).json({
                message: error || 'Invalid data'
            });
        }

        this.clientServices.createClient(createDto)
        .then( result => {
            res.status(201).json(result);
        })
        .catch( error => {
            this.handleError(error, res);
        });
    }

    getClient = (req: Request, res: Response) => {
        const { id } = req.params;

        this.clientServices.getClientById(id)
        .then( result => {
            res.json(result);
        })
        .catch( error => {
            this.handleError(error, res);
        });
    }

    getAllClients = (req: Request, res: Response) => {
        this.clientServices.getAllClients()
        .then( result => {
            res.json(result);
        })
        .catch( error => {
            this.handleError(error, res);
        });
    }

    updateClient = (req: Request, res: Response) => {
        const { id } = req.params;
        const [error, updateDto] = UpdateClientDto.create(req.body);

        if (error || !updateDto) {
            return res.status(400).json({
                message: error || 'Invalid data'
            });
        }

        this.clientServices.updateClient(id, updateDto)
        .then( result => {
            res.json(result);
        })
        .catch( error => {
            this.handleError(error, res);
        });
    }

    deleteClient = (req: Request, res: Response) => {
        const { id } = req.params;

        this.clientServices.deleteClient(id)
        .then( result => {
            res.json(result);
        })
        .catch( error => {
            this.handleError(error, res);
        });
    }
}

