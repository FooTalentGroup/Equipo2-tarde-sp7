import { Request, Response } from 'express';
import { CustomError, CreateLeadDto, UpdateLeadDto } from '../../domain';
import { LeadServices } from '../services/lead.services';

export class LeadController {
    constructor(
        private readonly leadServices: LeadServices
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

    createLead = (req: Request, res: Response) => {
        const [error, createDto] = CreateLeadDto.create(req.body);

        if (error || !createDto) {
            return res.status(400).json({
                message: error || 'Invalid data'
            });
        }

        this.leadServices.createLead(createDto)
        .then( result => {
            res.status(201).json(result);
        })
        .catch( error => {
            this.handleError(error, res);
        });
    }

    getLead = (req: Request, res: Response) => {
        const { id } = req.params;

        this.leadServices.getLeadById(id)
        .then( result => {
            res.json(result);
        })
        .catch( error => {
            this.handleError(error, res);
        });
    }

    getAllLeads = (req: Request, res: Response) => {
        this.leadServices.getAllLeads()
        .then( result => {
            res.json(result);
        })
        .catch( error => {
            this.handleError(error, res);
        });
    }

    getLeadsByProperty = (req: Request, res: Response) => {
        const { propertyId } = req.params;

        this.leadServices.getLeadsByProperty(propertyId)
        .then( result => {
            res.json(result);
        })
        .catch( error => {
            this.handleError(error, res);
        });
    }

    updateLead = (req: Request, res: Response) => {
        const { id } = req.params;
        const [error, updateDto] = UpdateLeadDto.create(req.body);

        if (error || !updateDto) {
            return res.status(400).json({
                message: error || 'Invalid data'
            });
        }

        this.leadServices.updateLead(id, updateDto)
        .then( result => {
            res.json(result);
        })
        .catch( error => {
            this.handleError(error, res);
        });
    }

    deleteLead = (req: Request, res: Response) => {
        const { id } = req.params;

        this.leadServices.deleteLead(id)
        .then( result => {
            res.json(result);
        })
        .catch( error => {
            this.handleError(error, res);
        });
    }
}

