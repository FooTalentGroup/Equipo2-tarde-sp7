import { Request, Response } from 'express';
import { CustomError, CreateContractDto, UpdateContractDto } from '../../domain';
import { ContractServices } from '../services/contract.services';

export class ContractController {
    constructor(
        private readonly contractServices: ContractServices
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

    createContract = (req: Request, res: Response) => {
        const [error, createDto] = CreateContractDto.create(req.body);
        if (error || !createDto) {
            return res.status(400).json({ message: error || 'Invalid data' });
        }
        this.contractServices.createContract(createDto)
        .then( result => res.status(201).json(result))
        .catch( error => this.handleError(error, res));
    }

    getContract = (req: Request, res: Response) => {
        const { id } = req.params;
        this.contractServices.getContractById(id)
        .then( result => res.json(result))
        .catch( error => this.handleError(error, res));
    }

    getAllContracts = (req: Request, res: Response) => {
        this.contractServices.getAllContracts()
        .then( result => res.json(result))
        .catch( error => this.handleError(error, res));
    }

    getContractsByProperty = (req: Request, res: Response) => {
        const { propertyId } = req.params;
        this.contractServices.getContractsByProperty(propertyId)
        .then( result => res.json(result))
        .catch( error => this.handleError(error, res));
    }

    getContractsByClient = (req: Request, res: Response) => {
        const { clientId } = req.params;
        this.contractServices.getContractsByClient(clientId)
        .then( result => res.json(result))
        .catch( error => this.handleError(error, res));
    }

    updateContract = (req: Request, res: Response) => {
        const { id } = req.params;
        const [error, updateDto] = UpdateContractDto.create(req.body);
        if (error || !updateDto) {
            return res.status(400).json({ message: error || 'Invalid data' });
        }
        this.contractServices.updateContract(id, updateDto)
        .then( result => res.json(result))
        .catch( error => this.handleError(error, res));
    }

    deleteContract = (req: Request, res: Response) => {
        const { id } = req.params;
        this.contractServices.deleteContract(id)
        .then( result => res.json(result))
        .catch( error => this.handleError(error, res));
    }
}

