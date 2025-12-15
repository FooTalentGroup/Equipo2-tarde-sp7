import { 
    ClientModel, 
    ClientPropertyInterestModel,
    ContactCategoryModel,
    PropertyModel,
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

        // Enriquecer con nombres de catálogos, propiedades y usar entities
        const { ContactCategoryModel } = await import('../../data/postgres/models/clients/contact-category.model');
        const enrichedClients = await Promise.all(
            clients.map(async (client) => {
                // Create entity from database object (no format validation needed for reading)
                const clientEntity = ClientEntity.fromDatabaseObject(client);
                const category = await ContactCategoryModel.findById(clientEntity.contact_category_id);
                
                // Obtener propiedades asociadas usando el helper
                const categoryName = category?.name || null;
                const properties = await this.enrichClientWithProperties(clientEntity.id, categoryName);
                
                return {
                    ...clientEntity.toPublicObject(),
                    contact_category: category ? {
                        id: category.id,
                        name: category.name
                    } : null,
                    ...properties
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

        // Obtener propiedades relacionadas usando el helper
        const categoryName = category?.name;
        const properties = await this.enrichClientWithProperties(clientEntity.id, categoryName || null);

        // Para Leads: obtener consultas con tipo de consulta
        let consultations: any[] = [];
        if (categoryName === 'Lead') {
            consultations = await this.getClientConsultations(clientEntity.id);
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
            },
            ...properties,
            ...(categoryName === 'Lead' && { consultations })
        };
    }

    /**
     * Helper privado: Enriquece los datos de una propiedad individual
     * Agrega precio, imagen principal, dirección completa, características y antigüedad
     */
    private async enrichPropertyDetails(property: any): Promise<any> {
        const { PropertyPriceModel } = await import('../../data/postgres/models/properties/property-price.model');
        const { PropertyMultimediaModel } = await import('../../data/postgres/models/properties/property-multimedia.model');
        const { PropertyAddressModel } = await import('../../data/postgres/models/properties/property-address.model');
        const { AddressModel } = await import('../../data/postgres/models/properties/address.model');
        const { PropertyAgeModel } = await import('../../data/postgres/models/properties/property-age.model');
        const { PropertyOperationTypeModel } = await import('../../data/postgres/models/properties/property-operation-type.model');
        const { CurrencyTypeModel } = await import('../../data/postgres/models/payments/currency-type.model');

        // Obtener todos los datos en paralelo para optimizar performance
        const [prices, mainImage, propertyAddresses, age] = await Promise.all([
            PropertyPriceModel.findByPropertyId(property.id),
            PropertyMultimediaModel.findPrimaryByPropertyId(property.id),
            PropertyAddressModel.findByPropertyId(property.id),
            property.age_id ? PropertyAgeModel.findById(property.age_id) : Promise.resolve(null)
        ]);

        // Procesar todos los precios (venta, alquiler, etc.)
        let pricesData: any[] = [];
        if (prices.length > 0) {
            pricesData = await Promise.all(
                prices.map(async (price) => {
                    const [currency, operationType] = await Promise.all([
                        CurrencyTypeModel.findById(price.currency_type_id),
                        PropertyOperationTypeModel.findById(price.operation_type_id)
                    ]);

                    return {
                        amount: price.price,
                        currency: currency ? {
                            id: currency.id,
                            name: currency.name,
                            symbol: currency.symbol
                        } : null,
                        operation_type: operationType ? {
                            id: operationType.id,
                            name: operationType.name
                        } : null
                    };
                })
            );
        }

        // Procesar dirección completa con ubicación
        let addressData = null;
        if (propertyAddresses.length > 0) {
            const address = await AddressModel.findById(propertyAddresses[0].address_id);
            if (address) {
                const city = await CityModel.findById(address.city_id);
                if (city) {
                    const province = await ProvinceModel.findById(city.province_id);
                    if (province) {
                        const country = await CountryModel.findById(province.country_id);
                        
                        addressData = {
                            full_address: address.full_address,
                            neighborhood: address.neighborhood,
                            city: {
                                id: city.id,
                                name: city.name,
                                province: {
                                    id: province.id,
                                    name: province.name,
                                    country: country ? {
                                        id: country.id,
                                        name: country.name
                                    } : null
                                }
                            },
                            location: {
                                latitude: address.latitude,
                                longitude: address.longitude
                            }
                        };
                    }
                }
            }
        }

        // Procesar imagen principal
        let imageData = null;
        if (mainImage) {
            imageData = {
                id: mainImage.id,
                url: mainImage.file_path,
                is_primary: true
            };
        }

        // Procesar antigüedad
        let ageData = null;
        if (age) {
            ageData = {
                id: age.id,
                name: age.name
            };
        }

        return {
            description: property.description,
            surface_area: property.total_area,
            bedrooms: property.bedrooms_count,
            bathrooms: property.bathrooms_count,
            garage: property.parking_spaces_count > 0,
            address: addressData,
            prices: pricesData,  // Array de precios
            main_image: imageData,
            age: ageData
        };
    }

    /**
     * Helper privado: Enriquece un cliente con sus propiedades asociadas
     * según su categoría (Lead, Propietario, Inquilino)
     */
    private async enrichClientWithProperties(
        clientId: number,
        categoryName: string | null
    ): Promise<{
        properties_of_interest: any[];
        owned_properties: any[];
        rented_property: any | null;
    }> {
        // Obtener propiedades relacionadas según el tipo de cliente
        const { PropertyModel } = await import('../../data/postgres/models/properties/property.model');
        const { PropertyTypeModel } = await import('../../data/postgres/models/properties/property-type.model');
        const { PropertyStatusModel } = await import('../../data/postgres/models/properties/property-status.model');
        const { ClientRentalModel } = await import('../../data/postgres/models/rentals/client-rental.model');
        const { RentalModel } = await import('../../data/postgres/models/rentals/rental.model');
        const { CurrencyTypeModel } = await import('../../data/postgres/models/payments/currency-type.model');

        let propertiesOfInterest: any[] = [];
        let ownedProperties: any[] = [];
        let rentedProperty: any = null;

        // Para Leads: obtener propiedades de interés desde client_property_interests
        if (categoryName === 'Lead') {
            const interests = await ClientPropertyInterestModel.findByClientId(clientId);
            
            if (interests.length > 0) {
                propertiesOfInterest = await Promise.all(
                    interests.map(async (interest) => {
                        const property = await PropertyModel.findById(interest.property_id);
                        if (!property) return null;
                        
                        const [propertyType, propertyStatus, enrichedDetails] = await Promise.all([
                            PropertyTypeModel.findById(property.property_type_id),
                            PropertyStatusModel.findById(property.property_status_id),
                            this.enrichPropertyDetails(property)
                        ]);

                        return {
                            id: property.id,
                            title: property.title,
                            ...enrichedDetails,
                            property_type: propertyType ? { id: propertyType.id, name: propertyType.name } : null,
                            property_status: propertyStatus ? { id: propertyStatus.id, name: propertyStatus.name } : null,
                            interest_created_at: interest.created_at,
                            interest_notes: interest.notes
                        };
                    })
                );
                propertiesOfInterest = propertiesOfInterest.filter(p => p !== null);
            }
        }

        // Para Owners: obtener propiedades propias desde properties donde owner_id = client.id
        if (categoryName === 'Propietario') {
            const properties = await PropertyModel.findAll({ owner_id: clientId });
            
            ownedProperties = await Promise.all(
                properties.map(async (property: any) => {
                    const [propertyType, propertyStatus, enrichedDetails] = await Promise.all([
                        PropertyTypeModel.findById(property.property_type_id),
                        PropertyStatusModel.findById(property.property_status_id),
                        this.enrichPropertyDetails(property)
                    ]);

                    return {
                        id: property.id,
                        title: property.title,
                        ...enrichedDetails,
                        property_type: propertyType ? { id: propertyType.id, name: propertyType.name } : null,
                        property_status: propertyStatus ? { id: propertyStatus.id, name: propertyStatus.name } : null,
                        publication_date: property.publication_date
                    };
                })
            );
        }

        // Para Inquilinos: obtener propiedad alquilada activa desde client_rentals
        if (categoryName === 'Inquilino') {
            const clientRentals = await ClientRentalModel.findByClientId(clientId);
            
            if (clientRentals.length > 0) {
                // Ordenar por fecha de inicio (más reciente primero)
                const sortedRentals = clientRentals.sort((a, b) => {
                    const dateA = a.contract_start_date ? new Date(a.contract_start_date).getTime() : 0;
                    const dateB = b.contract_start_date ? new Date(b.contract_start_date).getTime() : 0;
                    return dateB - dateA;
                });

                // Buscar el alquiler activo (contract_end_date IS NULL o >= fecha actual)
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                const activeRental = sortedRentals.find((rental) => {
                    if (!rental.contract_end_date) return true; // Sin fecha de fin = activo
                    const endDate = new Date(rental.contract_end_date);
                    endDate.setHours(0, 0, 0, 0);
                    return endDate >= today;
                });

                if (activeRental && activeRental.property_id) {
                    const property = await PropertyModel.findById(activeRental.property_id);
                    if (property) {
                        const [propertyType, propertyStatus, enrichedDetails] = await Promise.all([
                            PropertyTypeModel.findById(property.property_type_id),
                            PropertyStatusModel.findById(property.property_status_id),
                            this.enrichPropertyDetails(property)
                        ]);

                        // Obtener información del alquiler desde rentals
                        const rentals = await RentalModel.findAll({ property_id: activeRental.property_id });
                        const rentalInfo = rentals.find((r: any) => r.client_rental_id === activeRental.id);

                        let currency = null;
                        if (rentalInfo?.currency_type_id) {
                            currency = await CurrencyTypeModel.findById(rentalInfo.currency_type_id);
                        }

                        rentedProperty = {
                            id: property.id,
                            title: property.title,
                            ...enrichedDetails,
                            property_type: propertyType ? { id: propertyType.id, name: propertyType.name } : null,
                            property_status: propertyStatus ? { id: propertyStatus.id, name: propertyStatus.name } : null,
                            rental: {
                                id: activeRental.id,
                                contract_start_date: activeRental.contract_start_date,
                                contract_end_date: activeRental.contract_end_date,
                                next_increase_date: activeRental.next_increase_date,
                                monthly_amount: rentalInfo?.monthly_amount || null,
                                currency: currency ? { id: currency.id, name: currency.name, symbol: currency.symbol } : null,
                                external_reference: activeRental.external_reference || null
                            }
                        };
                    }
                }
            }

            // También obtener propiedades de interés para Inquilinos (pueden tener múltiples)
            const interests = await ClientPropertyInterestModel.findByClientId(clientId);
            
            if (interests.length > 0) {
                propertiesOfInterest = await Promise.all(
                    interests.map(async (interest) => {
                        const property = await PropertyModel.findById(interest.property_id);
                        if (!property) return null;
                        
                        const [propertyType, propertyStatus, enrichedDetails] = await Promise.all([
                            PropertyTypeModel.findById(property.property_type_id),
                            PropertyStatusModel.findById(property.property_status_id),
                            this.enrichPropertyDetails(property)
                        ]);

                        return {
                            id: property.id,
                            title: property.title,
                            ...enrichedDetails,
                            property_type: propertyType ? { id: propertyType.id, name: propertyType.name } : null,
                            property_status: propertyStatus ? { id: propertyStatus.id, name: propertyStatus.name } : null,
                            interest_created_at: interest.created_at,
                            interest_notes: interest.notes
                        };
                    })
                );
                propertiesOfInterest = propertiesOfInterest.filter(p => p !== null);
            }
        }

        return {
            properties_of_interest: propertiesOfInterest, // Para Leads e Inquilinos
            owned_properties: ownedProperties, // Para Owners
            rented_property: rentedProperty // Para Inquilinos (solo la activa)
        };
    }

    /**
     * Helper privado: Obtiene las consultas de un cliente con información de tipo
     * Incluye el tipo de consulta para cada consulta asociada
     */
    private async getClientConsultations(clientId: number): Promise<any[]> {
        const { ClientConsultationModel } = await import('../../data/postgres/models/crm/client-consultation.model');
        const { ConsultationTypeModel } = await import('../../data/postgres/models/crm/consultation-type.model');
        
        // Obtener todas las consultas del cliente
        const consultations = await ClientConsultationModel.findByClientId(clientId);
        
        if (consultations.length === 0) {
            return [];
        }
        
        // Enriquecer cada consulta con su tipo
        const enrichedConsultations = await Promise.all(
            consultations.map(async (consultation) => {
                const consultationType = await ConsultationTypeModel.findById(consultation.consultation_type_id);
                
                // Obtener información de la propiedad si existe
                let property = null;
                if (consultation.property_id) {
                    const propertyData = await PropertyModel.findById(consultation.property_id);
                    if (propertyData) {
                        property = {
                            id: propertyData.id,
                            title: propertyData.title
                        };
                    }
                }
                
                return {
                    id: consultation.id,
                    consultation_date: consultation.consultation_date,
                    message: consultation.message,
                    response: consultation.response || null,
                    response_date: consultation.response_date || null,
                    is_read: consultation.is_read || false,
                    consultation_type: consultationType ? {
                        id: consultationType.id,
                        name: consultationType.name
                    } : null,
                    property: property
                };
            })
        );
        
        return enrichedConsultations;
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
        const updateData: Record<string, unknown> = {};
        
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

    /**
     * Agrega una propiedad de interés a un cliente (Lead o Inquilino)
     */
    async addPropertyOfInterest(clientId: number, propertyId: number, notes?: string) {
        // Verificar que el cliente existe
        const client = await ClientModel.findById(clientId);
        if (!client) {
            throw CustomError.notFound(`Client with ID ${clientId} not found`);
        }

        // Verificar que la propiedad existe
        const property = await PropertyModel.findById(propertyId);
        if (!property) {
            throw CustomError.notFound(`Property with ID ${propertyId} not found`);
        }

        // Crear la relación en client_property_interests
        const propertyInterest = await ClientPropertyInterestModel.create({
            client_id: clientId,
            property_id: propertyId,
            notes: notes || undefined,
        });

        // Obtener información enriquecida de la propiedad
        const { PropertyTypeModel } = await import('../../data/postgres/models/properties/property-type.model');
        const { PropertyStatusModel } = await import('../../data/postgres/models/properties/property-status.model');
        
        const [propertyType, propertyStatus] = await Promise.all([
            PropertyTypeModel.findById(property.property_type_id),
            PropertyStatusModel.findById(property.property_status_id)
        ]);

        return {
            property_interest: {
                id: propertyInterest.id,
                client_id: propertyInterest.client_id,
                property_id: propertyInterest.property_id,
                created_at: propertyInterest.created_at,
                notes: propertyInterest.notes,
            },
            property: {
                id: property.id,
                title: property.title,
                property_type: propertyType ? { id: propertyType.id, name: propertyType.name } : null,
                property_status: propertyStatus ? { id: propertyStatus.id, name: propertyStatus.name } : null,
            }
        };
    }

    /**
     * Asocia una propiedad a un Owner (actualiza owner_id en la propiedad)
     */
    async addOwnedProperty(clientId: number, propertyId: number) {
        // Verificar que el cliente existe y es Owner
        const client = await ClientModel.findById(clientId);
        if (!client) {
            throw CustomError.notFound(`Client with ID ${clientId} not found`);
        }

        // Verificar que es Owner
        const { ContactCategoryModel } = await import('../../data/postgres/models/clients/contact-category.model');
        const category = await ContactCategoryModel.findById(client.contact_category_id);
        
        if (!category || category.name !== 'Propietario') {
            throw CustomError.badRequest('Client must be an Owner to associate properties');
        }

        // Verificar que la propiedad existe
        const property = await PropertyModel.findById(propertyId);
        if (!property) {
            throw CustomError.notFound(`Property with ID ${propertyId} not found`);
        }

        // Actualizar el owner_id de la propiedad
        const updatedProperty = await PropertyModel.update(propertyId, {
            owner_id: clientId
        });

        if (!updatedProperty) {
            throw CustomError.internalServerError('Failed to associate property with owner');
        }

        // Obtener información enriquecida de la propiedad
        const { PropertyTypeModel } = await import('../../data/postgres/models/properties/property-type.model');
        const { PropertyStatusModel } = await import('../../data/postgres/models/properties/property-status.model');
        
        const [propertyType, propertyStatus] = await Promise.all([
            PropertyTypeModel.findById(updatedProperty.property_type_id),
            PropertyStatusModel.findById(updatedProperty.property_status_id)
        ]);

        return {
            property: {
                id: updatedProperty.id,
                title: updatedProperty.title,
                owner_id: updatedProperty.owner_id,
                property_type: propertyType ? { id: propertyType.id, name: propertyType.name } : null,
                property_status: propertyStatus ? { id: propertyStatus.id, name: propertyStatus.name } : null,
                publication_date: updatedProperty.publication_date
            }
        };
    }
}

