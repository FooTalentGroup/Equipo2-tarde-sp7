import { Request, Response } from 'express';
import { UpdateClientDto } from '../../domain';
import { CreateTenantDto } from '../../domain/dtos/clients/create-tenant.dto';
import { CreateOwnerDto } from '../../domain/dtos/clients/create-owner.dto';
import { CreateLeadDto } from '../../domain/dtos/clients/create-lead.dto';
import { ClientServices } from '../services/client.services';
import { TenantServices } from '../services/tenant.services';
import { OwnerServices } from '../services/owner.services';
import { LeadServices } from '../services/lead.services';
import { ErrorHandlerUtil } from '../shared/error-handler.util';

export class ClientController {
    constructor(
        private readonly clientServices: ClientServices,
        private readonly tenantServices: TenantServices,
        private readonly ownerServices: OwnerServices,
        private readonly leadServices: LeadServices
    ) {}

    /**
     * Crea un nuevo inquilino con propiedad y contrato de alquiler
     */
    createTenant = async (req: Request, res: Response) => {
        try {
            const user = req.user;
            if (!user || !user.id) {
                return res.status(401).json({
                    message: 'User not authenticated'
                });
            }

            const [error, createTenantDto] = CreateTenantDto.create(req.body);

            if (error || !createTenantDto) {
                return res.status(400).json({
                    message: error || 'Invalid tenant data'
                });
            }

            const result = await this.tenantServices.createTenantWithProperty(
                createTenantDto,
                Number(user.id)
            );

            return res.status(201).json({
                message: 'Tenant created successfully',
                data: result
            });
        } catch (error) {
            ErrorHandlerUtil.handleError(error, res, 'Client');
        }
    }

    /**
     * Crea un nuevo propietario y lo asocia a una propiedad si se proporciona
     */
    createOwner = async (req: Request, res: Response) => {
        try {
            const [error, createOwnerDto] = CreateOwnerDto.create(req.body);

            if (error || !createOwnerDto) {
                return res.status(400).json({
                    message: error || 'Invalid owner data'
                });
            }

            const result = await this.ownerServices.createOwnerWithProperty(createOwnerDto);

            return res.status(201).json({
                message: 'Owner created successfully',
                data: result
            });
        } catch (error) {
            ErrorHandlerUtil.handleError(error, res, 'Client');
        }
    }

    /**
     * Crea un nuevo Lead con propiedad de interés si se proporciona
     */
    createLead = async (req: Request, res: Response) => {
        try {
            const [error, createLeadDto] = CreateLeadDto.create(req.body);

            if (error || !createLeadDto) {
                return res.status(400).json({
                    message: error || 'Invalid lead data'
                });
            }

            const result = await this.leadServices.createLeadWithConsultation(
                createLeadDto
            );

            return res.status(201).json({
                message: 'Lead created successfully',
                data: result
            });
        } catch (error) {
            ErrorHandlerUtil.handleError(error, res, 'Client');
        }
    }

    /**
     * Lista clientes con filtros opcionales
     */
    listClients = async (req: Request, res: Response) => {
        try {
            const {
                contact_category_id,
                purchase_interest,
                rental_interest,
                city_id,
                search,
                includeDeleted,
                limit,
                offset,
            } = req.query;

            const filters: Record<string, unknown> = {};

            if (contact_category_id) filters.contact_category_id = Number(contact_category_id);
            if (purchase_interest !== undefined) filters.purchase_interest = purchase_interest === 'true';
            if (rental_interest !== undefined) filters.rental_interest = rental_interest === 'true';
            if (city_id) filters.city_id = Number(city_id);
            if (search) filters.search = String(search);
            if (limit) filters.limit = Number(limit);
            if (offset) filters.offset = Number(offset);
            if (includeDeleted === 'true') filters.includeDeleted = true;

            const result = await this.clientServices.listClients(filters);
            return res.json(result);
        } catch (error) {
            ErrorHandlerUtil.handleError(error, res, 'Client');
        }
    }

    /**
     * Obtiene un cliente por ID
     */
    getClientById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            if (!id || isNaN(Number(id))) {
                return res.status(400).json({
                    message: 'Invalid client ID'
                });
            }

            const result = await this.clientServices.getClientById(Number(id));
            return res.json(result);
        } catch (error) {
            ErrorHandlerUtil.handleError(error, res, 'Client');
        }
    }

    /**
     * Actualiza un cliente
     */
    updateClient = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            if (!id || isNaN(Number(id))) {
                return res.status(400).json({
                    message: 'Invalid client ID'
                });
            }

            const [error, updateClientDto] = UpdateClientDto.create(req.body);

            if (error || !updateClientDto) {
                return res.status(400).json({
                    message: error || 'Invalid client data'
                });
            }

            const result = await this.clientServices.updateClient(Number(id), updateClientDto);
            return res.json({
                message: 'Client updated successfully',
                data: result
            });
        } catch (error) {
            ErrorHandlerUtil.handleError(error, res, 'Client');
        }
    }

    /**
     * Soft delete: marca el cliente como eliminado
     */
    deleteClient = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            if (!id || isNaN(Number(id))) {
                return res.status(400).json({
                    message: 'Invalid client ID'
                });
            }

            const result = await this.clientServices.deleteClient(Number(id));
            return res.json(result);
        } catch (error) {
            ErrorHandlerUtil.handleError(error, res, 'Client');
        }
    }

    /**
     * Restaura un cliente eliminado
     */
    restoreClient = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            if (!id || isNaN(Number(id))) {
                return res.status(400).json({
                    message: 'Invalid client ID'
                });
            }

            const result = await this.clientServices.restoreClient(Number(id));
            return res.json(result);
        } catch (error) {
            ErrorHandlerUtil.handleError(error, res, 'Client');
        }
    }

    /**
     * Agrega una propiedad de interés a un cliente
     */
    addPropertyOfInterest = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { property_id, notes } = req.body;

            if (!id || isNaN(Number(id))) {
                return res.status(400).json({
                    message: 'Invalid client ID'
                });
            }

            if (!property_id || isNaN(Number(property_id))) {
                return res.status(400).json({
                    message: 'property_id is required and must be a valid number'
                });
            }

            const result = await this.clientServices.addPropertyOfInterest(
                Number(id),
                Number(property_id),
                notes
            );

            return res.status(201).json({
                message: 'Property of interest added successfully',
                data: result
            });
        } catch (error) {
            ErrorHandlerUtil.handleError(error, res, 'Client');
        }
    }

    /**
     * Asocia una propiedad a un Owner
     */
    addOwnedProperty = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { property_id } = req.body;

            if (!id || isNaN(Number(id))) {
                return res.status(400).json({
                    message: 'Invalid client ID'
                });
            }

            if (!property_id || isNaN(Number(property_id))) {
                return res.status(400).json({
                    message: 'property_id is required and must be a valid number'
                });
            }

            const result = await this.clientServices.addOwnedProperty(
                Number(id),
                Number(property_id)
            );

            return res.status(200).json({
                message: 'Property associated with owner successfully',
                data: result
            });
        } catch (error) {
            ErrorHandlerUtil.handleError(error, res, 'Client');
        }
    }
}




