import { ClientModel } from "../../data/postgres/models";
import { ClientEntity, CreateClientDto, CustomError, UpdateClientDto } from "../../domain";

export class ClientServices {
    public async createClient(createClientDto: CreateClientDto) {
        try {
            // Verificar si el email ya existe (si se proporciona)
            if (createClientDto.email) {
                const existingClient = await ClientModel.findByEmail(createClientDto.email);
                if (existingClient) {
                    throw CustomError.conflict('Client with this email already exists');
                }
            }
            
            // Verificar si el DNI ya existe (si se proporciona)
            if (createClientDto.dni) {
                const existingClient = await ClientModel.findByDni(createClientDto.dni);
                if (existingClient) {
                    throw CustomError.conflict('Client with this DNI already exists');
                }
            }
            
            // Crear cliente en la base de datos
            const client = await ClientModel.create({
                first_name: createClientDto.first_name,
                last_name: createClientDto.last_name,
                email: createClientDto.email,
                phone: createClientDto.phone,
                dni: createClientDto.dni
            });

            // Convertir a Entity
            const clientEntity = ClientEntity.fromObject(client);
            
            return clientEntity;
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error creating client: ${error}`);
        }
    }

    public async getClientById(id: string) {
        try {
            const client = await ClientModel.findById(id);
            if (!client) {
                throw CustomError.notFound('Client not found');
            }
            
            const clientEntity = ClientEntity.fromObject(client);
            return clientEntity;
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error getting client: ${error}`);
        }
    }

    public async getAllClients() {
        try {
            const clients = await ClientModel.findAll();
            return clients.map(client => ClientEntity.fromObject(client));
        } catch (error) {
            throw CustomError.internalServerError(`Error getting clients: ${error}`);
        }
    }

    public async updateClient(id: string, updateClientDto: UpdateClientDto) {
        try {
            // Verificar que el cliente existe
            const existingClient = await ClientModel.findById(id);
            if (!existingClient) {
                throw CustomError.notFound('Client not found');
            }
            
            // Verificar si el email ya existe en otro cliente (si se está actualizando)
            if (updateClientDto.email && updateClientDto.email !== existingClient.email) {
                const clientWithEmail = await ClientModel.findByEmail(updateClientDto.email);
                if (clientWithEmail && clientWithEmail.id !== id) {
                    throw CustomError.conflict('Client with this email already exists');
                }
            }
            
            // Verificar si el DNI ya existe en otro cliente (si se está actualizando)
            if (updateClientDto.dni && updateClientDto.dni !== existingClient.dni) {
                const clientWithDni = await ClientModel.findByDni(updateClientDto.dni);
                if (clientWithDni && clientWithDni.id !== id) {
                    throw CustomError.conflict('Client with this DNI already exists');
                }
            }
            
            // Actualizar cliente
            const updatedClient = await ClientModel.update(id, {
                first_name: updateClientDto.first_name,
                last_name: updateClientDto.last_name,
                email: updateClientDto.email,
                phone: updateClientDto.phone,
                dni: updateClientDto.dni
            });
            
            if (!updatedClient) {
                throw CustomError.notFound('Client not found');
            }
            
            const clientEntity = ClientEntity.fromObject(updatedClient);
            return clientEntity;
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error updating client: ${error}`);
        }
    }

    public async deleteClient(id: string) {
        try {
            // Verificar que el cliente existe
            const existingClient = await ClientModel.findById(id);
            if (!existingClient) {
                throw CustomError.notFound('Client not found');
            }
            
            const deleted = await ClientModel.delete(id);
            if (!deleted) {
                throw CustomError.notFound('Client not found');
            }
            
            return { message: 'Client deleted successfully' };
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error deleting client: ${error}`);
        }
    }
}

