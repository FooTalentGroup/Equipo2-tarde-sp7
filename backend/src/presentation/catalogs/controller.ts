import { Request, Response } from 'express';
import { CustomError, CreateCatalogDto, UpdateCatalogDto } from '../../domain';
import { CatalogServices } from '../services/catalog.services';

export class CatalogController {
    constructor(
        private readonly catalogServices: CatalogServices
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

    // Countries
    getAllCountries = (req: Request, res: Response) => {
        this.catalogServices.getAllCountries()
        .then( result => {
            res.json(result);
        })
        .catch( error => {
            this.handleError(error, res);
        });
    }

    getCountry = (req: Request, res: Response) => {
        const { id } = req.params;
        this.catalogServices.getCountryById(id)
        .then( result => {
            res.json(result);
        })
        .catch( error => {
            this.handleError(error, res);
        });
    }

    // Cities
    getCitiesByCountry = (req: Request, res: Response) => {
        const { countryId } = req.params;
        this.catalogServices.getCitiesByCountry(countryId)
        .then( result => {
            res.json(result);
        })
        .catch( error => {
            this.handleError(error, res);
        });
    }

    getCity = (req: Request, res: Response) => {
        const { id } = req.params;
        this.catalogServices.getCityById(id)
        .then( result => {
            res.json(result);
        })
        .catch( error => {
            this.handleError(error, res);
        });
    }

    // Departments
    getDepartmentsByCity = (req: Request, res: Response) => {
        const { cityId } = req.params;
        this.catalogServices.getDepartmentsByCity(cityId)
        .then( result => {
            res.json(result);
        })
        .catch( error => {
            this.handleError(error, res);
        });
    }

    getDepartment = (req: Request, res: Response) => {
        const { id } = req.params;
        this.catalogServices.getDepartmentById(id)
        .then( result => {
            res.json(result);
        })
        .catch( error => {
            this.handleError(error, res);
        });
    }

    // Property Types
    createPropertyType = (req: Request, res: Response) => {
        const [error, createDto] = CreateCatalogDto.create(req.body);
        if (error || !createDto) {
            return res.status(400).json({ message: error || 'Invalid data' });
        }
        this.catalogServices.createPropertyType(createDto)
        .then( result => res.status(201).json(result))
        .catch( error => this.handleError(error, res));
    }

    getAllPropertyTypes = (req: Request, res: Response) => {
        this.catalogServices.getAllPropertyTypes()
        .then( result => {
            res.json(result);
        })
        .catch( error => {
            this.handleError(error, res);
        });
    }

    getPropertyType = (req: Request, res: Response) => {
        const { id } = req.params;
        this.catalogServices.getPropertyTypeById(id)
        .then( result => res.json(result))
        .catch( error => this.handleError(error, res));
    }

    updatePropertyType = (req: Request, res: Response) => {
        const { id } = req.params;
        const [error, updateDto] = UpdateCatalogDto.create(req.body);
        if (error || !updateDto) {
            return res.status(400).json({ message: error || 'Invalid data' });
        }
        this.catalogServices.updatePropertyType(id, updateDto)
        .then( result => res.json(result))
        .catch( error => this.handleError(error, res));
    }

    deletePropertyType = (req: Request, res: Response) => {
        const { id } = req.params;
        this.catalogServices.deletePropertyType(id)
        .then( result => res.json(result))
        .catch( error => this.handleError(error, res));
    }

    // Property Status
    createPropertyStatus = (req: Request, res: Response) => {
        const [error, createDto] = CreateCatalogDto.create(req.body);
        if (error || !createDto) {
            return res.status(400).json({ message: error || 'Invalid data' });
        }
        this.catalogServices.createPropertyStatus(createDto)
        .then( result => res.status(201).json(result))
        .catch( error => this.handleError(error, res));
    }

    getAllPropertyStatus = (req: Request, res: Response) => {
        this.catalogServices.getAllPropertyStatus()
        .then( result => {
            res.json(result);
        })
        .catch( error => {
            this.handleError(error, res);
        });
    }

    getPropertyStatus = (req: Request, res: Response) => {
        const { id } = req.params;
        this.catalogServices.getPropertyStatusById(id)
        .then( result => res.json(result))
        .catch( error => this.handleError(error, res));
    }

    updatePropertyStatus = (req: Request, res: Response) => {
        const { id } = req.params;
        const [error, updateDto] = UpdateCatalogDto.create(req.body);
        if (error || !updateDto) {
            return res.status(400).json({ message: error || 'Invalid data' });
        }
        this.catalogServices.updatePropertyStatus(id, updateDto)
        .then( result => res.json(result))
        .catch( error => this.handleError(error, res));
    }

    deletePropertyStatus = (req: Request, res: Response) => {
        const { id } = req.params;
        this.catalogServices.deletePropertyStatus(id)
        .then( result => res.json(result))
        .catch( error => this.handleError(error, res));
    }

    // Operation Types
    createOperationType = (req: Request, res: Response) => {
        const [error, createDto] = CreateCatalogDto.create(req.body);
        if (error || !createDto) {
            return res.status(400).json({ message: error || 'Invalid data' });
        }
        this.catalogServices.createOperationType(createDto)
        .then( result => res.status(201).json(result))
        .catch( error => this.handleError(error, res));
    }

    getAllOperationTypes = (req: Request, res: Response) => {
        this.catalogServices.getAllOperationTypes()
        .then( result => {
            res.json(result);
        })
        .catch( error => {
            this.handleError(error, res);
        });
    }

    getOperationType = (req: Request, res: Response) => {
        const { id } = req.params;
        this.catalogServices.getOperationTypeById(id)
        .then( result => res.json(result))
        .catch( error => this.handleError(error, res));
    }

    updateOperationType = (req: Request, res: Response) => {
        const { id } = req.params;
        const [error, updateDto] = UpdateCatalogDto.create(req.body);
        if (error || !updateDto) {
            return res.status(400).json({ message: error || 'Invalid data' });
        }
        this.catalogServices.updateOperationType(id, updateDto)
        .then( result => res.json(result))
        .catch( error => this.handleError(error, res));
    }

    deleteOperationType = (req: Request, res: Response) => {
        const { id } = req.params;
        this.catalogServices.deleteOperationType(id)
        .then( result => res.json(result))
        .catch( error => this.handleError(error, res));
    }

    // Amenities
    createAmenity = (req: Request, res: Response) => {
        const [error, createDto] = CreateCatalogDto.create(req.body);
        if (error || !createDto) {
            return res.status(400).json({ message: error || 'Invalid data' });
        }
        this.catalogServices.createAmenity(createDto)
        .then( result => res.status(201).json(result))
        .catch( error => this.handleError(error, res));
    }

    getAllAmenities = (req: Request, res: Response) => {
        this.catalogServices.getAllAmenities()
        .then( result => {
            res.json(result);
        })
        .catch( error => {
            this.handleError(error, res);
        });
    }

    getAmenity = (req: Request, res: Response) => {
        const { id } = req.params;
        this.catalogServices.getAmenityById(id)
        .then( result => res.json(result))
        .catch( error => this.handleError(error, res));
    }

    updateAmenity = (req: Request, res: Response) => {
        const { id } = req.params;
        const [error, updateDto] = UpdateCatalogDto.create(req.body);
        if (error || !updateDto) {
            return res.status(400).json({ message: error || 'Invalid data' });
        }
        this.catalogServices.updateAmenity(id, updateDto)
        .then( result => res.json(result))
        .catch( error => this.handleError(error, res));
    }

    deleteAmenity = (req: Request, res: Response) => {
        const { id } = req.params;
        this.catalogServices.deleteAmenity(id)
        .then( result => res.json(result))
        .catch( error => this.handleError(error, res));
    }

    // Services
    createService = (req: Request, res: Response) => {
        const [error, createDto] = CreateCatalogDto.create(req.body);
        if (error || !createDto) {
            return res.status(400).json({ message: error || 'Invalid data' });
        }
        this.catalogServices.createService(createDto)
        .then( result => res.status(201).json(result))
        .catch( error => this.handleError(error, res));
    }

    getAllServices = (req: Request, res: Response) => {
        this.catalogServices.getAllServices()
        .then( result => {
            res.json(result);
        })
        .catch( error => {
            this.handleError(error, res);
        });
    }

    getService = (req: Request, res: Response) => {
        const { id } = req.params;
        this.catalogServices.getServiceById(id)
        .then( result => res.json(result))
        .catch( error => this.handleError(error, res));
    }

    updateService = (req: Request, res: Response) => {
        const { id } = req.params;
        const [error, updateDto] = UpdateCatalogDto.create(req.body);
        if (error || !updateDto) {
            return res.status(400).json({ message: error || 'Invalid data' });
        }
        this.catalogServices.updateService(id, updateDto)
        .then( result => res.json(result))
        .catch( error => this.handleError(error, res));
    }

    deleteService = (req: Request, res: Response) => {
        const { id } = req.params;
        this.catalogServices.deleteService(id)
        .then( result => res.json(result))
        .catch( error => this.handleError(error, res));
    }

    // Lead Status
    createLeadStatus = (req: Request, res: Response) => {
        const [error, createDto] = CreateCatalogDto.create(req.body);
        if (error || !createDto) {
            return res.status(400).json({ message: error || 'Invalid data' });
        }
        this.catalogServices.createLeadStatus(createDto)
        .then( result => res.status(201).json(result))
        .catch( error => this.handleError(error, res));
    }

    getAllLeadStatus = (req: Request, res: Response) => {
        this.catalogServices.getAllLeadStatus()
        .then( result => {
            res.json(result);
        })
        .catch( error => {
            this.handleError(error, res);
        });
    }

    getLeadStatus = (req: Request, res: Response) => {
        const { id } = req.params;
        this.catalogServices.getLeadStatusById(id)
        .then( result => res.json(result))
        .catch( error => this.handleError(error, res));
    }

    updateLeadStatus = (req: Request, res: Response) => {
        const { id } = req.params;
        const [error, updateDto] = UpdateCatalogDto.create(req.body);
        if (error || !updateDto) {
            return res.status(400).json({ message: error || 'Invalid data' });
        }
        this.catalogServices.updateLeadStatus(id, updateDto)
        .then( result => res.json(result))
        .catch( error => this.handleError(error, res));
    }

    deleteLeadStatus = (req: Request, res: Response) => {
        const { id } = req.params;
        this.catalogServices.deleteLeadStatus(id)
        .then( result => res.json(result))
        .catch( error => this.handleError(error, res));
    }

    // Roles
    createRole = (req: Request, res: Response) => {
        const [error, createDto] = CreateCatalogDto.create(req.body);
        if (error || !createDto) {
            return res.status(400).json({ message: error || 'Invalid data' });
        }
        this.catalogServices.createRole(createDto)
        .then( result => res.status(201).json(result))
        .catch( error => this.handleError(error, res));
    }

    getAllRoles = (req: Request, res: Response) => {
        this.catalogServices.getAllRoles()
        .then( result => {
            res.json(result);
        })
        .catch( error => {
            this.handleError(error, res);
        });
    }

    getRole = (req: Request, res: Response) => {
        const { id } = req.params;
        this.catalogServices.getRoleById(id)
        .then( result => res.json(result))
        .catch( error => this.handleError(error, res));
    }

    updateRole = (req: Request, res: Response) => {
        const { id } = req.params;
        const [error, updateDto] = UpdateCatalogDto.create(req.body);
        if (error || !updateDto) {
            return res.status(400).json({ message: error || 'Invalid data' });
        }
        this.catalogServices.updateRole(id, updateDto)
        .then( result => res.json(result))
        .catch( error => this.handleError(error, res));
    }

    deleteRole = (req: Request, res: Response) => {
        const { id } = req.params;
        this.catalogServices.deleteRole(id)
        .then( result => res.json(result))
        .catch( error => this.handleError(error, res));
    }
}

