import { Request, Response } from 'express';
import { CustomError, CreateAddressDto, UpdateAddressDto } from '../../domain';
import { AddressServices } from '../services/address.services';

export class AddressController {
    constructor(
        private readonly addressServices: AddressServices
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

    createAddress = (req: Request, res: Response) => {
        const [error, createDto] = CreateAddressDto.create(req.body);

        if (error || !createDto) {
            return res.status(400).json({
                message: error || 'Invalid data'
            });
        }

        this.addressServices.createAddress(createDto)
        .then( result => {
            res.status(201).json(result);
        })
        .catch( error => {
            this.handleError(error, res);
        });
    }

    getAddress = (req: Request, res: Response) => {
        const { id } = req.params;

        this.addressServices.getAddressById(id)
        .then( result => {
            res.json(result);
        })
        .catch( error => {
            this.handleError(error, res);
        });
    }

    getAllAddresses = (req: Request, res: Response) => {
        this.addressServices.getAllAddresses()
        .then( result => {
            res.json(result);
        })
        .catch( error => {
            this.handleError(error, res);
        });
    }

    getAddressesByDepartment = (req: Request, res: Response) => {
        const { departmentId } = req.params;

        this.addressServices.getAddressesByDepartment(departmentId)
        .then( result => {
            res.json(result);
        })
        .catch( error => {
            this.handleError(error, res);
        });
    }

    updateAddress = (req: Request, res: Response) => {
        const { id } = req.params;
        const [error, updateDto] = UpdateAddressDto.create(req.body);

        if (error || !updateDto) {
            return res.status(400).json({
                message: error || 'Invalid data'
            });
        }

        this.addressServices.updateAddress(id, updateDto)
        .then( result => {
            res.json(result);
        })
        .catch( error => {
            this.handleError(error, res);
        });
    }

    deleteAddress = (req: Request, res: Response) => {
        const { id } = req.params;

        this.addressServices.deleteAddress(id)
        .then( result => {
            res.json(result);
        })
        .catch( error => {
            this.handleError(error, res);
        });
    }
}

