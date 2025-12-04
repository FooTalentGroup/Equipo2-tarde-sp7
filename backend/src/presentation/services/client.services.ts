import { 
    ClientModel, 
    ContactCategoryModel,
    CityModel,
    ProvinceModel,
    CountryModel
} from '../../data/postgres/models';
import { UpdateClientDto } from '../../domain/dtos/clients';
import { CustomError, ClientEntity, hasValueChanged, normalizePhone } from '../../domain';

/**
 * Service para manejar operaciones de clientes
 */
export class ClientServices {
    
    /**
     * Lista clientes con filtros opcionales
     */
    async listClients(filters?: {
        contact_category_id?: number;
        purchase_interest?: boolean;
        rental_interest?: boolean;
        city_id?: number;
        limit?: number;
        offset?: number;
        search?: string;
        includeDeleted?: boolean;
    }) {
        let clients = await ClientModel.findAll(filters);

        // Si hay búsqueda por texto, filtrar en memoria
        if (filters?.search) {
            const searchLower = filters.search.toLowerCase();
            clients = clients.filter(client => 
                client.first_name?.toLowerCase().includes(searchLower) ||
                client.last_name?.toLowerCase().includes(searchLower) ||
                client.email?.toLowerCase().includes(searchLower) ||
                client.phone?.includes(searchLower) ||
                client.dni?.includes(searchLower)
            );
        }

        // Enriquecer con nombres de catálogos y usar entities
        const { ContactCategoryModel } = await import('../../data/postgres/models/clients/contact-category.model');
        const enrichedClients = await Promise.all(
            clients.map(async (client) => {
                // Create entity from database object (no format validation needed for reading)
                const clientEntity = ClientEntity.fromDatabaseObject(client);
                const category = await ContactCategoryModel.findById(clientEntity.contact_category_id);
                return {
                    ...clientEntity.toPublicObject(),
                    contact_category: category ? {
                        id: category.id,
                        name: category.name
                    } : null
                };
            })
        );

        return { clients: enrichedClients, count: enrichedClients.length };
    }

    /**
     * Obtiene un cliente por ID
     */
    async getClientById(id: number) {
        const client = await ClientModel.findById(id);
        if (!client) {
            throw CustomError.notFound(`Client with ID ${id} not found`);
        }

        // Create entity from database object (no format validation needed for reading)
        const clientEntity = ClientEntity.fromDatabaseObject(client);

        // Enriquecer con nombres de catálogos
        const { ContactCategoryModel } = await import('../../data/postgres/models/clients/contact-category.model');
        const category = await ContactCategoryModel.findById(clientEntity.contact_category_id);
        
        let propertySearchType = null;
        if (clientEntity.property_search_type_id) {
            const { PropertySearchTypeModel } = await import('../../data/postgres/models/clients/property-search-type.model');
            propertySearchType = await PropertySearchTypeModel.findById(clientEntity.property_search_type_id);
        }

        let city = null;
        if (clientEntity.city_id) {
            city = await CityModel.findById(clientEntity.city_id);
            if (city) {
                const province = await ProvinceModel.findById(city.province_id);
                if (province) {
                    const country = await CountryModel.findById(province.country_id);
                    (city as any).province = province ? {
                        id: province.id,
                        name: province.name,
                        country: country ? {
                            id: country.id,
                            name: country.name
                        } : null
                    } : null;
                }
            }
        }

        return {
            client: {
                ...clientEntity.toPublicObject(),
                contact_category: category ? {
                    id: category.id,
                    name: category.name
                } : null,
                property_search_type: propertySearchType ? {
                    id: propertySearchType.id,
                    name: propertySearchType.name
                } : null,
                city: city
            }
        };
    }

    /**
     * Actualiza un cliente
     */
    async updateClient(id: number, updateClientDto: UpdateClientDto) {
        // Verificar que el cliente existe y crear entity
        const existingClient = await ClientModel.findById(id);
        if (!existingClient) {
            throw CustomError.notFound(`Client with ID ${id} not found`);
        }

        // Create entity from database object to check business rules
        const clientEntity = ClientEntity.fromDatabaseObject(existingClient);
        
        // Check if client can be updated
        if (!clientEntity.canBeUpdated()) {
            throw CustomError.badRequest('Cannot update deleted client');
        }

        // Resolver contact_category_id si se envió nombre
        let contactCategoryId: number | undefined = updateClientDto.contact_category_id;
        if (!contactCategoryId && updateClientDto.contact_category) {
            const category = await ContactCategoryModel.findByName(updateClientDto.contact_category);
            if (!category || !category.id) {
                throw CustomError.badRequest(
                    `Contact category "${updateClientDto.contact_category}" not found. Valid categories: Lead, Inquilino, Propietario`
                );
            }
            contactCategoryId = category.id;
        }

        // Resolver property_search_type_id si se envió nombre
        let propertySearchTypeId: number | undefined = updateClientDto.property_search_type_id;
        if (!propertySearchTypeId && updateClientDto.property_search_type) {
            const { PropertySearchTypeModel } = await import('../../data/postgres/models/clients/property-search-type.model');
            const searchType = await PropertySearchTypeModel.findByName(updateClientDto.property_search_type);
            if (!searchType || !searchType.id) {
                throw CustomError.badRequest(
                    `Property search type "${updateClientDto.property_search_type}" not found`
                );
            }
            propertySearchTypeId = searchType.id;
        }

        // Preparar datos de actualización - solo incluir campos que realmente cambiaron
        const updateData: any = {};
        
        if (updateClientDto.first_name !== undefined && hasValueChanged(updateClientDto.first_name, existingClient.first_name)) {
            updateData.first_name = updateClientDto.first_name;
        }
        if (updateClientDto.last_name !== undefined && hasValueChanged(updateClientDto.last_name, existingClient.last_name)) {
            updateData.last_name = updateClientDto.last_name;
        }
        if (updateClientDto.phone !== undefined && hasValueChanged(updateClientDto.phone, existingClient.phone)) {
            updateData.phone = normalizePhone(updateClientDto.phone);
        }
        if (updateClientDto.email !== undefined && hasValueChanged(updateClientDto.email, existingClient.email)) {
            updateData.email = updateClientDto.email;
        }
        if (updateClientDto.dni !== undefined && hasValueChanged(updateClientDto.dni, existingClient.dni)) {
            updateData.dni = updateClientDto.dni;
        }
        if (updateClientDto.property_interest_phone !== undefined && hasValueChanged(updateClientDto.property_interest_phone, existingClient.property_interest_phone)) {
            updateData.property_interest_phone = normalizePhone(updateClientDto.property_interest_phone);
        }
        if (updateClientDto.address !== undefined && hasValueChanged(updateClientDto.address, existingClient.address)) {
            updateData.address = updateClientDto.address;
        }
        if (updateClientDto.notes !== undefined && hasValueChanged(updateClientDto.notes, existingClient.notes)) {
            updateData.notes = updateClientDto.notes;
        }
        if (contactCategoryId !== undefined && hasValueChanged(contactCategoryId, existingClient.contact_category_id)) {
            updateData.contact_category_id = contactCategoryId;
        }
        if (updateClientDto.interest_zone !== undefined && hasValueChanged(updateClientDto.interest_zone, existingClient.interest_zone)) {
            updateData.interest_zone = updateClientDto.interest_zone;
        }
        if (updateClientDto.purchase_interest !== undefined && hasValueChanged(updateClientDto.purchase_interest, existingClient.purchase_interest)) {
            updateData.purchase_interest = updateClientDto.purchase_interest;
        }
        if (updateClientDto.rental_interest !== undefined && hasValueChanged(updateClientDto.rental_interest, existingClient.rental_interest)) {
            updateData.rental_interest = updateClientDto.rental_interest;
        }
        if (propertySearchTypeId !== undefined && hasValueChanged(propertySearchTypeId, existingClient.property_search_type_id)) {
            updateData.property_search_type_id = propertySearchTypeId;
        }
        if (updateClientDto.city_id !== undefined && hasValueChanged(updateClientDto.city_id, existingClient.city_id)) {
            updateData.city_id = updateClientDto.city_id;
        }

        // Si no hay cambios, retornar el cliente existente sin actualizar
        if (Object.keys(updateData).length === 0) {
            return { client: clientEntity.toPublicObject() };
        }

        // Actualizar cliente solo con los campos que cambiaron
        const updatedClient = await ClientModel.update(id, updateData);
        if (!updatedClient) {
            throw CustomError.internalServerError('Failed to update client');
        }

        // Create entity from database object (data already validated before saving)
        const updatedClientEntity = ClientEntity.fromDatabaseObject(updatedClient);

        return { client: updatedClientEntity.toPublicObject() };
    }

    /**
     * Soft delete: marca el cliente como eliminado
     */
    async deleteClient(id: number) {
        const client = await ClientModel.findById(id);
        if (!client) {
            throw CustomError.notFound(`Client with ID ${id} not found`);
        }

        // Check if client is already deleted (no need to create entity for this simple check)
        if (client.deleted === true) {
            throw CustomError.badRequest('Client is already deleted');
        }

        const deleted = await ClientModel.delete(id);
        if (!deleted) {
            throw CustomError.internalServerError('Failed to delete client');
        }

        return { message: 'Client deleted successfully' };
    }

    /**
     * Restaura un cliente eliminado (soft delete)
     */
    async restoreClient(id: number) {
        const restored = await ClientModel.restore(id);
        if (!restored) {
            throw CustomError.notFound(`Deleted client with ID ${id} not found or already restored`);
        }

        return { message: 'Client restored successfully' };
    }

    /**
     * Helper para resolver geografía (country -> province -> city)
     */
    private async resolveGeography(geography: {
        country?: string;
        province?: string;
        city?: string;
    }): Promise<{ cityId: number }> {
        if (!geography.country || !geography.province || !geography.city) {
            throw CustomError.badRequest('Country, province, and city are required for geography');
        }

        // Buscar o crear país
        let country = await CountryModel.findByName(geography.country);
        if (!country || !country.id) {
            country = await CountryModel.create({ name: geography.country });
        }

        // Buscar o crear provincia
        let province = await ProvinceModel.findByName(geography.province);
        if (!province || !province.id) {
            province = await ProvinceModel.create({
                name: geography.province,
                country_id: country.id!
            });
        }

        // Buscar o crear ciudad
        let city = await CityModel.findByNameAndProvince(geography.city, province.id!);
        if (!city || !city.id) {
            city = await CityModel.create({
                name: geography.city,
                province_id: province.id!
            });
        }

        return { cityId: city.id! };
    }
}

