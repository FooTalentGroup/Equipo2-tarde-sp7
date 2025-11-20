import { ContractModel, PropertyModel, ClientModel } from "../../data/postgres/models";
import { ContractEntity, CreateContractDto, CustomError, UpdateContractDto } from "../../domain";

export class ContractServices {
    public async createContract(createContractDto: CreateContractDto) {
        try {
            // Verificar que la propiedad existe (si se proporciona)
            if (createContractDto.property_id) {
                const property = await PropertyModel.findById(createContractDto.property_id);
                if (!property) {
                    throw CustomError.notFound('Property not found');
                }
            }
            
            // Verificar que el cliente existe (si se proporciona)
            if (createContractDto.client_id) {
                const client = await ClientModel.findById(createContractDto.client_id);
                if (!client) {
                    throw CustomError.notFound('Client not found');
                }
            }
            
            const contract = await ContractModel.create({
                property_id: createContractDto.property_id,
                client_id: createContractDto.client_id,
                contract_url: createContractDto.contract_url,
                description: createContractDto.description
            });

            const contractEntity = ContractEntity.fromObject(contract);
            return contractEntity;
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error creating contract: ${error}`);
        }
    }

    public async getContractById(id: string) {
        try {
            const contract = await ContractModel.findById(id);
            if (!contract) {
                throw CustomError.notFound('Contract not found');
            }
            return ContractEntity.fromObject(contract);
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error getting contract: ${error}`);
        }
    }

    public async getAllContracts() {
        try {
            const contracts = await ContractModel.findAll();
            return contracts.map(contract => ContractEntity.fromObject(contract));
        } catch (error) {
            throw CustomError.internalServerError(`Error getting contracts: ${error}`);
        }
    }

    public async getContractsByProperty(propertyId: string) {
        try {
            const property = await PropertyModel.findById(propertyId);
            if (!property) {
                throw CustomError.notFound('Property not found');
            }
            const contracts = await ContractModel.findByProperty(propertyId);
            return contracts.map(contract => ContractEntity.fromObject(contract));
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error getting contracts by property: ${error}`);
        }
    }

    public async getContractsByClient(clientId: string) {
        try {
            const client = await ClientModel.findById(clientId);
            if (!client) {
                throw CustomError.notFound('Client not found');
            }
            const contracts = await ContractModel.findByClient(clientId);
            return contracts.map(contract => ContractEntity.fromObject(contract));
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error getting contracts by client: ${error}`);
        }
    }

    public async updateContract(id: string, updateContractDto: UpdateContractDto) {
        try {
            const existing = await ContractModel.findById(id);
            if (!existing) {
                throw CustomError.notFound('Contract not found');
            }
            
            if (updateContractDto.property_id) {
                const property = await PropertyModel.findById(updateContractDto.property_id);
                if (!property) {
                    throw CustomError.notFound('Property not found');
                }
            }
            
            if (updateContractDto.client_id) {
                const client = await ClientModel.findById(updateContractDto.client_id);
                if (!client) {
                    throw CustomError.notFound('Client not found');
                }
            }
            
            const updated = await ContractModel.update(id, {
                property_id: updateContractDto.property_id,
                client_id: updateContractDto.client_id,
                contract_url: updateContractDto.contract_url,
                description: updateContractDto.description
            });
            
            if (!updated) {
                throw CustomError.notFound('Contract not found');
            }
            return ContractEntity.fromObject(updated);
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error updating contract: ${error}`);
        }
    }

    public async deleteContract(id: string) {
        try {
            const existing = await ContractModel.findById(id);
            if (!existing) {
                throw CustomError.notFound('Contract not found');
            }
            const deleted = await ContractModel.delete(id);
            if (!deleted) {
                throw CustomError.notFound('Contract not found');
            }
            return { message: 'Contract deleted successfully' };
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error deleting contract: ${error}`);
        }
    }
}

