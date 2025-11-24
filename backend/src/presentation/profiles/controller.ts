import { Request, Response } from 'express';
import { CustomError, CreateProfileDto, UpdateProfileDto } from '../../domain';
import { ProfileServices } from '../services/profile.services';

export class ProfileController {
    constructor(
        private readonly profileServices: ProfileServices
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

    createProfile = (req: Request, res: Response) => {
        const [error, createDto] = CreateProfileDto.create(req.body);
        if (error || !createDto) {
            return res.status(400).json({ message: error || 'Invalid data' });
        }
        this.profileServices.createProfile(createDto)
        .then( result => res.status(201).json(result))
        .catch( error => this.handleError(error, res));
    }

    getAllProfiles = (req: Request, res: Response) => {
        this.profileServices.getAllProfiles()
        .then( result => res.json(result))
        .catch( error => this.handleError(error, res));
    }

    getProfile = (req: Request, res: Response) => {
        const { id } = req.params;
        this.profileServices.getProfileById(id)
        .then( result => res.json(result))
        .catch( error => this.handleError(error, res));
    }

    updateProfile = (req: Request, res: Response) => {
        const { id } = req.params;
        const [error, updateDto] = UpdateProfileDto.create(req.body);
        if (error || !updateDto) {
            return res.status(400).json({ message: error || 'Invalid data' });
        }
        this.profileServices.updateProfile(id, updateDto)
        .then( result => res.json(result))
        .catch( error => this.handleError(error, res));
    }

    deleteProfile = (req: Request, res: Response) => {
        const { id } = req.params;
        this.profileServices.deleteProfile(id)
        .then( result => res.json(result))
        .catch( error => this.handleError(error, res));
    }
}

