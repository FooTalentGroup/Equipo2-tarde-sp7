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
import type { PropertyRow, RentalInfoRow, ConsultationRow, PropertyPriceRow } from '../../domain/interfaces/database-rows';
import type {
    EnrichedConsultation,
    PropertyDetails,
    CurrencyInfo,
    OperationTypeInfo,
    PropertyOfInterest,
    OwnedPropertyWithDetails,
    RentedPropertyWithDetails
} from '../../domain/interfaces/enriched-data';


export class ClientServices {
    
  
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

        const { ContactCategoryModel } = await import('../../data/postgres/models/clients/contact-category.model');
        const enrichedClients = await Promise.all(
            clients.map(async (client) => {
                const clientEntity = ClientEntity.fromDatabaseObject(client);
                const category = await ContactCategoryModel.findById(clientEntity.contact_category_id);
                
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

    async getClientById(id: number) {
        const client = await ClientModel.findById(id);
        if (!client) {
            throw CustomError.notFound(`Client with ID ${id} not found`);
        }

        const clientEntity = ClientEntity.fromDatabaseObject(client);

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
                    
                    interface CityWithProvince {
                        id: number | undefined;
                        name: string;
                        province_id: number;
                        province?: {
                            id: number | undefined;
                            name: string;
                            country: { id: number | undefined; name: string } | null;
                        } | null;
                    }
                    const cityWithProvince = city as CityWithProvince;
                    cityWithProvince.province = province ? {
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

        const categoryName = category?.name;
        const properties = await this.enrichClientWithProperties(clientEntity.id, categoryName || null);

        let consultations: EnrichedConsultation[] = [];
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

    private async enrichPropertyDetails(property: PropertyRow): Promise<PropertyDetails> {
        const { PropertyPriceModel } = await import('../../data/postgres/models/properties/property-price.model');
        const { PropertyMultimediaModel } = await import('../../data/postgres/models/properties/property-multimedia.model');
        const { PropertyAddressModel } = await import('../../data/postgres/models/properties/property-address.model');
        const { AddressModel } = await import('../../data/postgres/models/properties/address.model');
        const { PropertyAgeModel } = await import('../../data/postgres/models/properties/property-age.model');
        const { PropertyOperationTypeModel } = await import('../../data/postgres/models/properties/property-operation-type.model');
        const { CurrencyTypeModel } = await import('../../data/postgres/models/payments/currency-type.model');

        const [prices, mainImage, propertyAddresses, age] = await Promise.all([
            PropertyPriceModel.findByPropertyId(property.id),
            PropertyMultimediaModel.findPrimaryByPropertyId(property.id),
            PropertyAddressModel.findByPropertyId(property.id),
            property.age_id ? PropertyAgeModel.findById(property.age_id) : Promise.resolve(null)
        ]);

        let pricesData: Array<{
            amount: number;
            currency: CurrencyInfo | null;
            operation_type: OperationTypeInfo | null;
        }> = [];
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
                            street: address.street || null,
                            number: address.number || null,
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
                                latitude: address.latitude ?? null,
                                longitude: address.longitude ?? null
                            }
                        };
                    }
                }
            }
        }

        let imageData = null;
        if (mainImage) {
            imageData = {
                id: mainImage.id,
                url: mainImage.file_path,
                is_primary: true
            };
        }

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
            garage: (property.parking_spaces_count || 0) > 0,
            address: addressData,
            prices: pricesData,  
            main_image: imageData,
            age: ageData
        };
    }

    private async enrichClientWithProperties(
        clientId: number,
        categoryName: string | null
    ): Promise<{
        properties_of_interest: PropertyOfInterest[];
        owned_properties: OwnedPropertyWithDetails[];
        rented_property: RentedPropertyWithDetails | null;
    }> {
        const { PropertyModel } = await import('../../data/postgres/models/properties/property.model');
        const { PropertyTypeModel } = await import('../../data/postgres/models/properties/property-type.model');
        const { PropertyStatusModel } = await import('../../data/postgres/models/properties/property-status.model');
        const { ClientRentalModel } = await import('../../data/postgres/models/rentals/client-rental.model');
        const { RentalModel } = await import('../../data/postgres/models/rentals/rental.model');
        const { CurrencyTypeModel } = await import('../../data/postgres/models/payments/currency-type.model');

        let propertiesOfInterest: PropertyOfInterest[] = [];
        let ownedProperties: OwnedPropertyWithDetails[] = [];
        let rentedProperty: RentedPropertyWithDetails | null = null;

        if (categoryName === 'Lead') {
            const interests = await ClientPropertyInterestModel.findByClientId(clientId);
            
            if (interests.length > 0) {
                const interestResults = await Promise.all(
                    interests.map(async (interest) => {
                        const property = await PropertyModel.findById(interest.property_id);
                        if (!property) return null;
                        
                        const [propertyType, propertyStatus, enrichedDetails] = await Promise.all([
                            PropertyTypeModel.findById(property.property_type_id),
                            PropertyStatusModel.findById(property.property_status_id),
                            this.enrichPropertyDetails(property as PropertyRow)
                        ]);

                        return {
                            id: property.id,
                            title: property.title,
                            ...enrichedDetails,
                            property_type: propertyType ? { id: propertyType.id, name: propertyType.name } : null,
                            property_status: propertyStatus ? { id: propertyStatus.id, name: propertyStatus.name } : null,
                            interest_created_at: interest.created_at,
                            interest_notes: interest.notes
                        } as PropertyOfInterest;
                    })
                );
                propertiesOfInterest = interestResults.filter((p): p is PropertyOfInterest => p !== null);
            }
        }

        if (categoryName === 'Propietario') {
            const properties = await PropertyModel.findAll({ owner_id: clientId });
            
            ownedProperties = await Promise.all(
                properties.map(async (property: PropertyRow) => {
                    const [propertyType, propertyStatus, enrichedDetails] = await Promise.all([
                        PropertyTypeModel.findById(property.property_type_id),
                        PropertyStatusModel.findById(property.property_status_id),
                        this.enrichPropertyDetails(property as PropertyRow)
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

        if (categoryName === 'Inquilino') {
            const clientRentals = await ClientRentalModel.findByClientId(clientId);
            
            if (clientRentals.length > 0) {
                const sortedRentals = clientRentals.sort((a, b) => {
                    const dateA = a.contract_start_date ? new Date(a.contract_start_date).getTime() : 0;
                    const dateB = b.contract_start_date ? new Date(b.contract_start_date).getTime() : 0;
                    return dateB - dateA;
                });

                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                const activeRental = sortedRentals.find((rental) => {
                    if (!rental.contract_end_date) return true;
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
                            this.enrichPropertyDetails(property as PropertyRow)
                        ]);

                        const rentals = await RentalModel.findAll({ property_id: activeRental.property_id });
                        const rentalInfo = rentals.find(r => r.client_rental_id === activeRental.id);

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
                                contract_start_date: activeRental.contract_start_date ?? null,
                                contract_end_date: activeRental.contract_end_date ?? null,
                                next_increase_date: activeRental.next_increase_date ?? null,
                                monthly_amount: rentalInfo?.monthly_amount ?? 0,
                                currency: currency ? { id: currency.id, name: currency.name, symbol: currency.symbol } : null,
                                external_reference: activeRental.external_reference || null
                            }
                        };
                    }
                }
            }

            const interests = await ClientPropertyInterestModel.findByClientId(clientId);
            
            if (interests.length > 0) {
                const interestResults = await Promise.all(
                    interests.map(async (interest) => {
                        const property = await PropertyModel.findById(interest.property_id);
                        if (!property) return null;
                        
                        const [propertyType, propertyStatus, enrichedDetails] = await Promise.all([
                            PropertyTypeModel.findById(property.property_type_id),
                            PropertyStatusModel.findById(property.property_status_id),
                            this.enrichPropertyDetails(property as PropertyRow)
                        ]);

                        return {
                            id: property.id,
                            title: property.title,
                            ...enrichedDetails,
                            property_type: propertyType ? { id: propertyType.id, name: propertyType.name } : null,
                            property_status: propertyStatus ? { id: propertyStatus.id, name: propertyStatus.name } : null,
                            interest_created_at: interest.created_at,
                            interest_notes: interest.notes
                        } as PropertyOfInterest;
                    })
                );
                propertiesOfInterest = interestResults.filter((p): p is PropertyOfInterest => p !== null);
            }
        }

        return {
            properties_of_interest: propertiesOfInterest,
            owned_properties: ownedProperties,
            rented_property: rentedProperty
        };
    }

    private async getClientConsultations(clientId: number): Promise<any[]> {
        const { ClientConsultationModel } = await import('../../data/postgres/models/crm/client-consultation.model');
        const { ConsultationTypeModel } = await import('../../data/postgres/models/crm/consultation-type.model');
        
        const consultations = await ClientConsultationModel.findByClientId(clientId);
        
        if (consultations.length === 0) {
            return [];
        }
        
        const enrichedConsultations = await Promise.all(
            consultations.map(async (consultation) => {
                const consultationType = await ConsultationTypeModel.findById(consultation.consultation_type_id);
                
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

    async updateClient(id: number, updateClientDto: UpdateClientDto) {
        const existingClient = await ClientModel.findById(id);
        if (!existingClient) {
            throw CustomError.notFound(`Client with ID ${id} not found`);
        }

        const clientEntity = ClientEntity.fromDatabaseObject(existingClient);
        
        if (!clientEntity.canBeUpdated()) {
            throw CustomError.badRequest('Cannot update deleted client');
        }

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

        if (Object.keys(updateData).length === 0) {
            return { client: clientEntity.toPublicObject() };
        }
        const updatedClient = await ClientModel.update(id, updateData);
        if (!updatedClient) {
            throw CustomError.internalServerError('Failed to update client');
        }

        const updatedClientEntity = ClientEntity.fromDatabaseObject(updatedClient);

        return { client: updatedClientEntity.toPublicObject() };
    }

    async deleteClient(id: number) {
        const client = await ClientModel.findById(id);
        if (!client) {
            throw CustomError.notFound(`Client with ID ${id} not found`);
        }

        if (client.deleted === true) {
            throw CustomError.badRequest('Client is already deleted');
        }

        const deleted = await ClientModel.delete(id);
        if (!deleted) {
            throw CustomError.internalServerError('Failed to delete client');
        }

        return { message: 'Client deleted successfully' };
    }

    
    async restoreClient(id: number) {
        const restored = await ClientModel.restore(id);
        if (!restored) {
            throw CustomError.notFound(`Deleted client with ID ${id} not found or already restored`);
        }

        return { message: 'Client restored successfully' };
    }

    private async resolveGeography(geography: {
        country?: string;
        province?: string;
        city?: string;
    }): Promise<{ cityId: number }> {
        if (!geography.country || !geography.province || !geography.city) {
            throw CustomError.badRequest('Country, province, and city are required for geography');
        }

        let country = await CountryModel.findByName(geography.country);
        if (!country || !country.id) {
            country = await CountryModel.create({ name: geography.country });
        }
        let province = await ProvinceModel.findByName(geography.province);
        if (!province || !province.id) {
            province = await ProvinceModel.create({
                name: geography.province,
                country_id: country.id!
            });
        }

        let city = await CityModel.findByNameAndProvince(geography.city, province.id!);
        if (!city || !city.id) {
            city = await CityModel.create({
                name: geography.city,
                province_id: province.id!
            });
        }

        return { cityId: city.id! };
    }

    async addPropertyOfInterest(clientId: number, propertyId: number, notes?: string) {
        const client = await ClientModel.findById(clientId);
        if (!client) {
            throw CustomError.notFound(`Client with ID ${clientId} not found`);
        }

        const property = await PropertyModel.findById(propertyId);
        if (!property) {
            throw CustomError.notFound(`Property with ID ${propertyId} not found`);
        }
        const propertyInterest = await ClientPropertyInterestModel.create({
            client_id: clientId,
            property_id: propertyId,
            notes: notes || undefined,
        });

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

    async addOwnedProperty(clientId: number, propertyId: number) {
        const client = await ClientModel.findById(clientId);
        if (!client) {
            throw CustomError.notFound(`Client with ID ${clientId} not found`);
        }

        const { ContactCategoryModel } = await import('../../data/postgres/models/clients/contact-category.model');
        const category = await ContactCategoryModel.findById(client.contact_category_id);
        
        if (!category || category.name !== 'Propietario') {
            throw CustomError.badRequest('Client must be an Owner to associate properties');
        }

        const property = await PropertyModel.findById(propertyId);
        if (!property) {
            throw CustomError.notFound(`Property with ID ${propertyId} not found`);
        }
        const updatedProperty = await PropertyModel.update(propertyId, {
            owner_id: clientId
        });

        if (!updatedProperty) {
            throw CustomError.internalServerError('Failed to associate property with owner');
        }

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

