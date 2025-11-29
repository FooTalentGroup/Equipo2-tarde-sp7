import { Request, Response } from 'express';
import { CustomError } from '../../domain';
import { CreatePropertyConsultationDto } from '../../domain/dtos/consultations/create-property-consultation.dto';
import { PropertyConsultationServices } from '../services/property-consultation.services';

export class ConsultationController {
    constructor(
        private readonly consultationServices: PropertyConsultationServices
    ) {}

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({
                message: error.message
            });
        }
        console.error('Consultation Controller Error:', error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }

    /**
     * Create a property consultation from public website
     * No authentication required - public endpoint
     */
    createPropertyConsultation = async (req: Request, res: Response) => {
        try {
            // Validate DTO
            const [error, createConsultationDto] = CreatePropertyConsultationDto.create(req.body);
            
            if (error || !createConsultationDto) {
                return res.status(400).json({
                    message: error || 'Invalid data'
                });
            }

            // Create consultation
            const result = await this.consultationServices.createPropertyConsultation(createConsultationDto);
            
            return res.status(201).json(result);
        } catch (error) {
            this.handleError(error, res);
        }
    }

    /**
     * Get all consultations with filters and pagination
     * Requires authentication
     */
    getAllConsultations = async (req: Request, res: Response) => {
        try {
            const { limit, offset, consultation_type_id, start_date, end_date } = req.query;

            const filters = {
                limit: limit ? parseInt(limit as string) : undefined,
                offset: offset ? parseInt(offset as string) : undefined,
                consultation_type_id: consultation_type_id ? parseInt(consultation_type_id as string) : undefined,
                start_date: start_date as string,
                end_date: end_date as string,
            };

            const result = await this.consultationServices.getAllConsultations(filters);
            
            return res.status(200).json(result);
        } catch (error) {
            this.handleError(error, res);
        }
    }
}
