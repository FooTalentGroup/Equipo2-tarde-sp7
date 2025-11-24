import { PropertyModel, AddressModel, ProfileModel, PropertyAmenityModel, PropertyServiceModel, AmenityModel, ServiceModel } from "../../data/postgres/models";
import { PropertyEntity, CreatePropertyDto, CustomError, UpdatePropertyDto, QueryPropertyDto, AddAmenityDto, AddServiceDto, CatalogEntity } from "../../domain";

export class PropertyServices {
    public async createProperty(createPropertyDto: CreatePropertyDto) {
        try {
            // Verificar que el owner existe
            const owner = await ProfileModel.findById(createPropertyDto.owner_id);
            if (!owner) {
                throw CustomError.notFound('Owner not found');
            }
            
            // Verificar que la dirección existe
            const address = await AddressModel.findById(createPropertyDto.address_id);
            if (!address) {
                throw CustomError.notFound('Address not found');
            }
            
            // Verificar que el cliente existe (si se proporciona)
            if (createPropertyDto.client_id) {
                // Note: Necesitaríamos importar ClientModel si queremos validar esto
                // Por ahora lo omitimos para no crear dependencias circulares
            }
            
            // Crear propiedad en la base de datos
            const property = await PropertyModel.create({
                title: createPropertyDto.title,
                description: createPropertyDto.description,
                price: createPropertyDto.price,
                bedrooms: createPropertyDto.bedrooms,
                bathrooms: createPropertyDto.bathrooms,
                owner_id: createPropertyDto.owner_id,
                client_id: createPropertyDto.client_id,
                address_id: createPropertyDto.address_id,
                status_id: createPropertyDto.status_id,
                property_type_id: createPropertyDto.property_type_id,
                operation_type_id: createPropertyDto.operation_type_id
            });

            // Convertir a Entity
            const propertyEntity = PropertyEntity.fromObject(property);
            
            return propertyEntity;
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error creating property: ${error}`);
        }
    }

    public async getPropertyById(id: string) {
        try {
            const property = await PropertyModel.findById(id);
            if (!property) {
                throw CustomError.notFound('Property not found');
            }
            
            const propertyEntity = PropertyEntity.fromObject(property);
            return propertyEntity;
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error getting property: ${error}`);
        }
    }

    public async getAllProperties(queryDto?: QueryPropertyDto) {
        try {
            let properties;
            
            if (queryDto) {
                // Aplicar filtros
                if (queryDto.owner_id) {
                    properties = await PropertyModel.findByOwnerId(queryDto.owner_id);
                } else if (queryDto.status_id) {
                    properties = await PropertyModel.findByStatus(queryDto.status_id);
                } else {
                    properties = await PropertyModel.findAll();
                }
                
                // Aplicar filtros adicionales en memoria (para simplificar)
                // En producción, esto debería hacerse en la consulta SQL
                if (queryDto.min_price !== undefined) {
                    properties = properties.filter(p => Number(p.price) >= queryDto.min_price!);
                }
                if (queryDto.max_price !== undefined) {
                    properties = properties.filter(p => Number(p.price) <= queryDto.max_price!);
                }
                if (queryDto.min_bedrooms !== undefined) {
                    properties = properties.filter(p => (p.bedrooms ?? 0) >= queryDto.min_bedrooms!);
                }
                if (queryDto.min_bathrooms !== undefined) {
                    properties = properties.filter(p => (p.bathrooms ?? 0) >= queryDto.min_bathrooms!);
                }
                if (queryDto.property_type_id) {
                    properties = properties.filter(p => p.property_type_id === queryDto.property_type_id);
                }
                if (queryDto.operation_type_id) {
                    properties = properties.filter(p => p.operation_type_id === queryDto.operation_type_id);
                }
                if (queryDto.client_id) {
                    properties = properties.filter(p => p.client_id === queryDto.client_id);
                }
                
                // Aplicar paginación
                const offset = queryDto.offset || 0;
                const limit = queryDto.limit || 100;
                properties = properties.slice(offset, offset + limit);
            } else {
                properties = await PropertyModel.findAll();
            }
            
            return properties.map(property => PropertyEntity.fromObject(property));
        } catch (error) {
            throw CustomError.internalServerError(`Error getting properties: ${error}`);
        }
    }

    public async updateProperty(id: string, updatePropertyDto: UpdatePropertyDto) {
        try {
            // Verificar que la propiedad existe
            const existingProperty = await PropertyModel.findById(id);
            if (!existingProperty) {
                throw CustomError.notFound('Property not found');
            }
            
            // Verificar que el owner existe (si se está actualizando)
            if (updatePropertyDto.owner_id) {
                const owner = await ProfileModel.findById(updatePropertyDto.owner_id);
                if (!owner) {
                    throw CustomError.notFound('Owner not found');
                }
            }
            
            // Verificar que la dirección existe (si se está actualizando)
            if (updatePropertyDto.address_id) {
                const address = await AddressModel.findById(updatePropertyDto.address_id);
                if (!address) {
                    throw CustomError.notFound('Address not found');
                }
            }
            
            // Actualizar propiedad
            const updatedProperty = await PropertyModel.update(id, {
                title: updatePropertyDto.title,
                description: updatePropertyDto.description,
                price: updatePropertyDto.price,
                bedrooms: updatePropertyDto.bedrooms,
                bathrooms: updatePropertyDto.bathrooms,
                owner_id: updatePropertyDto.owner_id,
                client_id: updatePropertyDto.client_id,
                address_id: updatePropertyDto.address_id,
                status_id: updatePropertyDto.status_id,
                property_type_id: updatePropertyDto.property_type_id,
                operation_type_id: updatePropertyDto.operation_type_id
            });
            
            if (!updatedProperty) {
                throw CustomError.notFound('Property not found');
            }
            
            const propertyEntity = PropertyEntity.fromObject(updatedProperty);
            return propertyEntity;
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error updating property: ${error}`);
        }
    }

    public async deleteProperty(id: string) {
        try {
            // Verificar que la propiedad existe
            const existingProperty = await PropertyModel.findById(id);
            if (!existingProperty) {
                throw CustomError.notFound('Property not found');
            }
            
            const deleted = await PropertyModel.delete(id);
            if (!deleted) {
                throw CustomError.notFound('Property not found');
            }
            
            return { message: 'Property deleted successfully' };
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error deleting property: ${error}`);
        }
    }

    // Property Amenities
    public async addAmenityToProperty(propertyId: string, addAmenityDto: AddAmenityDto) {
        try {
            // Verificar que la propiedad existe
            const property = await PropertyModel.findById(propertyId);
            if (!property) {
                throw CustomError.notFound('Property not found');
            }
            
            // Verificar que el amenity existe
            const amenity = await AmenityModel.findById(addAmenityDto.amenity_id);
            if (!amenity) {
                throw CustomError.notFound('Amenity not found');
            }
            
            // Verificar que no existe ya la relación
            const existing = await PropertyAmenityModel.findOne(propertyId, addAmenityDto.amenity_id);
            if (existing) {
                throw CustomError.conflict('Amenity already added to this property');
            }
            
            // Crear relación
            await PropertyAmenityModel.create(propertyId, addAmenityDto.amenity_id);
            
            return { message: 'Amenity added to property successfully' };
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error adding amenity to property: ${error}`);
        }
    }

    public async removeAmenityFromProperty(propertyId: string, amenityId: string) {
        try {
            // Verificar que la propiedad existe
            const property = await PropertyModel.findById(propertyId);
            if (!property) {
                throw CustomError.notFound('Property not found');
            }
            
            // Verificar que la relación existe
            const existing = await PropertyAmenityModel.findOne(propertyId, amenityId);
            if (!existing) {
                throw CustomError.notFound('Amenity not found in this property');
            }
            
            // Eliminar relación
            const deleted = await PropertyAmenityModel.delete(propertyId, amenityId);
            if (!deleted) {
                throw CustomError.notFound('Amenity not found in this property');
            }
            
            return { message: 'Amenity removed from property successfully' };
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error removing amenity from property: ${error}`);
        }
    }

    public async getPropertyAmenities(propertyId: string) {
        try {
            // Verificar que la propiedad existe
            const property = await PropertyModel.findById(propertyId);
            if (!property) {
                throw CustomError.notFound('Property not found');
            }
            
            // Obtener relaciones
            const relations = await PropertyAmenityModel.findByProperty(propertyId);
            
            // Obtener detalles de amenities
            const amenities = await Promise.all(
                relations.map(async (rel) => {
                    const amenity = await AmenityModel.findById(rel.amenity_id);
                    if (!amenity) return null;
                    return CatalogEntity.fromObject(amenity);
                })
            );
            
            return amenities.filter(a => a !== null);
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error getting property amenities: ${error}`);
        }
    }

    // Property Services
    public async addServiceToProperty(propertyId: string, addServiceDto: AddServiceDto) {
        try {
            // Verificar que la propiedad existe
            const property = await PropertyModel.findById(propertyId);
            if (!property) {
                throw CustomError.notFound('Property not found');
            }
            
            // Verificar que el service existe
            const service = await ServiceModel.findById(addServiceDto.service_id);
            if (!service) {
                throw CustomError.notFound('Service not found');
            }
            
            // Verificar que no existe ya la relación
            const existing = await PropertyServiceModel.findOne(propertyId, addServiceDto.service_id);
            if (existing) {
                throw CustomError.conflict('Service already added to this property');
            }
            
            // Crear relación
            await PropertyServiceModel.create(propertyId, addServiceDto.service_id);
            
            return { message: 'Service added to property successfully' };
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error adding service to property: ${error}`);
        }
    }

    public async removeServiceFromProperty(propertyId: string, serviceId: string) {
        try {
            // Verificar que la propiedad existe
            const property = await PropertyModel.findById(propertyId);
            if (!property) {
                throw CustomError.notFound('Property not found');
            }
            
            // Verificar que la relación existe
            const existing = await PropertyServiceModel.findOne(propertyId, serviceId);
            if (!existing) {
                throw CustomError.notFound('Service not found in this property');
            }
            
            // Eliminar relación
            const deleted = await PropertyServiceModel.delete(propertyId, serviceId);
            if (!deleted) {
                throw CustomError.notFound('Service not found in this property');
            }
            
            return { message: 'Service removed from property successfully' };
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error removing service from property: ${error}`);
        }
    }

    public async getPropertyServices(propertyId: string) {
        try {
            // Verificar que la propiedad existe
            const property = await PropertyModel.findById(propertyId);
            if (!property) {
                throw CustomError.notFound('Property not found');
            }
            
            // Obtener relaciones
            const relations = await PropertyServiceModel.findByProperty(propertyId);
            
            // Obtener detalles de services
            const services = await Promise.all(
                relations.map(async (rel) => {
                    const service = await ServiceModel.findById(rel.id_service);
                    if (!service) return null;
                    return CatalogEntity.fromObject(service);
                })
            );
            
            return services.filter(s => s !== null);
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error getting property services: ${error}`);
        }
    }
}

