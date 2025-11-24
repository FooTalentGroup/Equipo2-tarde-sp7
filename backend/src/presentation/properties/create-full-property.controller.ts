import { Request, Response } from 'express';
import { CustomError, CreateFullPropertyDto } from '../../domain';
import { CreateFullPropertyService } from '../services/create-full-property.service';

export class CreateFullPropertyController {
    constructor(
        private readonly createFullPropertyService: CreateFullPropertyService
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

    createFullProperty = (req: Request, res: Response) => {
        // Manejar errores de multer (si hay)
        if ((req as any).multerError) {
            return res.status(400).json({
                message: (req as any).multerError.message || 'Error uploading file'
            });
        }

        // Obtener owner_id del token JWT (ya validado por el middleware)
        const user = (req as any).user;
        if (!user || !user.id) {
            return res.status(401).json({
                message: 'User not authenticated'
            });
        }

        const ownerId = user.id;

        // Obtener archivo subido (si existe)
        const file = (req as any).file;

        // Parsear FormData: propertyDetails y location vienen como strings JSON
        let body = { ...req.body };
        
        try {
            // Si propertyDetails es un string, parsearlo
            if (typeof body.propertyDetails === 'string') {
                body.propertyDetails = JSON.parse(body.propertyDetails);
            }
            
            // Si location es un string, parsearlo
            if (typeof body.location === 'string') {
                body.location = JSON.parse(body.location);
            }
        } catch (parseError) {
            return res.status(400).json({
                message: 'Invalid JSON in propertyDetails or location'
            });
        }

        // Validar DTO (pasar el archivo si existe)
        const [error, createDto] = CreateFullPropertyDto.create(body, file);
        if (error || !createDto) {
            return res.status(400).json({
                message: error || 'Invalid data'
            });
        }

        this.createFullPropertyService.createFullProperty(createDto, ownerId)
        .then( result => {
            res.status(201).json(result);
        })
        .catch( error => {
            this.handleError(error, res);
        });
    }
}

