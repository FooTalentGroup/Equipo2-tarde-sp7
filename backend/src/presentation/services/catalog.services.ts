import { 
    CountryModel, 
    CityModel, 
    DepartmentModel,
    PropertyTypeModel,
    PropertyStatusModel,
    OperationTypeModel,
    AmenityModel,
    ServiceModel,
    LeadStatusModel,
    RoleModel
} from "../../data/postgres/models";
import { CatalogEntity, CustomError, CreateCatalogDto, UpdateCatalogDto } from "../../domain";

export class CatalogServices {
    // Countries
    public async getAllCountries() {
        try {
            const countries = await CountryModel.findAll();
            return countries.map(country => CatalogEntity.fromObject(country));
        } catch (error) {
            throw CustomError.internalServerError(`Error getting countries: ${error}`);
        }
    }

    public async getCountryById(id: string) {
        try {
            const country = await CountryModel.findById(id);
            if (!country) {
                throw CustomError.notFound('Country not found');
            }
            return CatalogEntity.fromObject(country);
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error getting country: ${error}`);
        }
    }

    // Cities
    public async getCitiesByCountry(countryId: string) {
        try {
            const cities = await CityModel.findByCountry(countryId);
            return cities.map(city => CatalogEntity.fromObject(city));
        } catch (error) {
            throw CustomError.internalServerError(`Error getting cities: ${error}`);
        }
    }

    public async getCityById(id: string) {
        try {
            const city = await CityModel.findById(id);
            if (!city) {
                throw CustomError.notFound('City not found');
            }
            return CatalogEntity.fromObject(city);
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error getting city: ${error}`);
        }
    }

    // Departments
    public async getDepartmentsByCity(cityId: string) {
        try {
            const departments = await DepartmentModel.findByCity(cityId);
            return departments.map(dept => CatalogEntity.fromObject(dept));
        } catch (error) {
            throw CustomError.internalServerError(`Error getting departments: ${error}`);
        }
    }

    public async getDepartmentById(id: string) {
        try {
            const department = await DepartmentModel.findById(id);
            if (!department) {
                throw CustomError.notFound('Department not found');
            }
            return CatalogEntity.fromObject(department);
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error getting department: ${error}`);
        }
    }

    // Property Types
    public async createPropertyType(createDto: CreateCatalogDto) {
        try {
            const existing = await PropertyTypeModel.findByTitle(createDto.title);
            if (existing) {
                throw CustomError.conflict('Property type with this title already exists');
            }
            const type = await PropertyTypeModel.create({ title: createDto.title });
            return CatalogEntity.fromObject(type);
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error creating property type: ${error}`);
        }
    }

    public async getAllPropertyTypes() {
        try {
            const types = await PropertyTypeModel.findAll();
            return types.map(type => CatalogEntity.fromObject(type));
        } catch (error) {
            throw CustomError.internalServerError(`Error getting property types: ${error}`);
        }
    }

    public async getPropertyTypeById(id: string) {
        try {
            const type = await PropertyTypeModel.findById(id);
            if (!type) {
                throw CustomError.notFound('Property type not found');
            }
            return CatalogEntity.fromObject(type);
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error getting property type: ${error}`);
        }
    }

    public async updatePropertyType(id: string, updateDto: UpdateCatalogDto) {
        try {
            const existing = await PropertyTypeModel.findById(id);
            if (!existing) {
                throw CustomError.notFound('Property type not found');
            }
            if (updateDto.title && updateDto.title !== existing.title) {
                const existingTitle = await PropertyTypeModel.findByTitle(updateDto.title);
                if (existingTitle) {
                    throw CustomError.conflict('Property type with this title already exists');
                }
            }
            const updated = await PropertyTypeModel.update(id, { title: updateDto.title });
            if (!updated) {
                throw CustomError.notFound('Property type not found');
            }
            return CatalogEntity.fromObject(updated);
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error updating property type: ${error}`);
        }
    }

    public async deletePropertyType(id: string) {
        try {
            const existing = await PropertyTypeModel.findById(id);
            if (!existing) {
                throw CustomError.notFound('Property type not found');
            }
            const deleted = await PropertyTypeModel.delete(id);
            if (!deleted) {
                throw CustomError.notFound('Property type not found');
            }
            return { message: 'Property type deleted successfully' };
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error deleting property type: ${error}`);
        }
    }

    // Property Status
    public async createPropertyStatus(createDto: CreateCatalogDto) {
        try {
            const existing = await PropertyStatusModel.findByTitle(createDto.title);
            if (existing) {
                throw CustomError.conflict('Property status with this title already exists');
            }
            const status = await PropertyStatusModel.create({ title: createDto.title });
            return CatalogEntity.fromObject(status);
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error creating property status: ${error}`);
        }
    }

    public async getAllPropertyStatus() {
        try {
            const statuses = await PropertyStatusModel.findAll();
            return statuses.map(status => CatalogEntity.fromObject(status));
        } catch (error) {
            throw CustomError.internalServerError(`Error getting property status: ${error}`);
        }
    }

    public async getPropertyStatusById(id: string) {
        try {
            const status = await PropertyStatusModel.findById(id);
            if (!status) {
                throw CustomError.notFound('Property status not found');
            }
            return CatalogEntity.fromObject(status);
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error getting property status: ${error}`);
        }
    }

    public async updatePropertyStatus(id: string, updateDto: UpdateCatalogDto) {
        try {
            const existing = await PropertyStatusModel.findById(id);
            if (!existing) {
                throw CustomError.notFound('Property status not found');
            }
            if (updateDto.title && updateDto.title !== existing.title) {
                const existingTitle = await PropertyStatusModel.findByTitle(updateDto.title);
                if (existingTitle) {
                    throw CustomError.conflict('Property status with this title already exists');
                }
            }
            const updated = await PropertyStatusModel.update(id, { title: updateDto.title });
            if (!updated) {
                throw CustomError.notFound('Property status not found');
            }
            return CatalogEntity.fromObject(updated);
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error updating property status: ${error}`);
        }
    }

    public async deletePropertyStatus(id: string) {
        try {
            const existing = await PropertyStatusModel.findById(id);
            if (!existing) {
                throw CustomError.notFound('Property status not found');
            }
            const deleted = await PropertyStatusModel.delete(id);
            if (!deleted) {
                throw CustomError.notFound('Property status not found');
            }
            return { message: 'Property status deleted successfully' };
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error deleting property status: ${error}`);
        }
    }

    // Operation Types
    public async createOperationType(createDto: CreateCatalogDto) {
        try {
            const existing = await OperationTypeModel.findByTitle(createDto.title);
            if (existing) {
                throw CustomError.conflict('Operation type with this title already exists');
            }
            const type = await OperationTypeModel.create({ title: createDto.title });
            return CatalogEntity.fromObject(type);
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error creating operation type: ${error}`);
        }
    }

    public async getAllOperationTypes() {
        try {
            const types = await OperationTypeModel.findAll();
            return types.map(type => CatalogEntity.fromObject(type));
        } catch (error) {
            throw CustomError.internalServerError(`Error getting operation types: ${error}`);
        }
    }

    public async getOperationTypeById(id: string) {
        try {
            const type = await OperationTypeModel.findById(id);
            if (!type) {
                throw CustomError.notFound('Operation type not found');
            }
            return CatalogEntity.fromObject(type);
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error getting operation type: ${error}`);
        }
    }

    public async updateOperationType(id: string, updateDto: UpdateCatalogDto) {
        try {
            const existing = await OperationTypeModel.findById(id);
            if (!existing) {
                throw CustomError.notFound('Operation type not found');
            }
            if (updateDto.title && updateDto.title !== existing.title) {
                const existingTitle = await OperationTypeModel.findByTitle(updateDto.title);
                if (existingTitle) {
                    throw CustomError.conflict('Operation type with this title already exists');
                }
            }
            const updated = await OperationTypeModel.update(id, { title: updateDto.title });
            if (!updated) {
                throw CustomError.notFound('Operation type not found');
            }
            return CatalogEntity.fromObject(updated);
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error updating operation type: ${error}`);
        }
    }

    public async deleteOperationType(id: string) {
        try {
            const existing = await OperationTypeModel.findById(id);
            if (!existing) {
                throw CustomError.notFound('Operation type not found');
            }
            const deleted = await OperationTypeModel.delete(id);
            if (!deleted) {
                throw CustomError.notFound('Operation type not found');
            }
            return { message: 'Operation type deleted successfully' };
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error deleting operation type: ${error}`);
        }
    }

    // Amenities
    public async createAmenity(createDto: CreateCatalogDto) {
        try {
            const existing = await AmenityModel.findByTitle(createDto.title);
            if (existing) {
                throw CustomError.conflict('Amenity with this title already exists');
            }
            const amenity = await AmenityModel.create({ title: createDto.title });
            return CatalogEntity.fromObject(amenity);
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error creating amenity: ${error}`);
        }
    }

    public async getAllAmenities() {
        try {
            const amenities = await AmenityModel.findAll();
            return amenities.map(amenity => CatalogEntity.fromObject(amenity));
        } catch (error) {
            throw CustomError.internalServerError(`Error getting amenities: ${error}`);
        }
    }

    public async getAmenityById(id: string) {
        try {
            const amenity = await AmenityModel.findById(id);
            if (!amenity) {
                throw CustomError.notFound('Amenity not found');
            }
            return CatalogEntity.fromObject(amenity);
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error getting amenity: ${error}`);
        }
    }

    public async updateAmenity(id: string, updateDto: UpdateCatalogDto) {
        try {
            const existing = await AmenityModel.findById(id);
            if (!existing) {
                throw CustomError.notFound('Amenity not found');
            }
            if (updateDto.title && updateDto.title !== existing.title) {
                const existingTitle = await AmenityModel.findByTitle(updateDto.title);
                if (existingTitle) {
                    throw CustomError.conflict('Amenity with this title already exists');
                }
            }
            const updated = await AmenityModel.update(id, { title: updateDto.title });
            if (!updated) {
                throw CustomError.notFound('Amenity not found');
            }
            return CatalogEntity.fromObject(updated);
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error updating amenity: ${error}`);
        }
    }

    public async deleteAmenity(id: string) {
        try {
            const existing = await AmenityModel.findById(id);
            if (!existing) {
                throw CustomError.notFound('Amenity not found');
            }
            const deleted = await AmenityModel.delete(id);
            if (!deleted) {
                throw CustomError.notFound('Amenity not found');
            }
            return { message: 'Amenity deleted successfully' };
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error deleting amenity: ${error}`);
        }
    }

    // Services
    public async createService(createDto: CreateCatalogDto) {
        try {
            const existing = await ServiceModel.findByTitle(createDto.title);
            if (existing) {
                throw CustomError.conflict('Service with this title already exists');
            }
            const service = await ServiceModel.create({ title: createDto.title });
            return CatalogEntity.fromObject(service);
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error creating service: ${error}`);
        }
    }

    public async getAllServices() {
        try {
            const services = await ServiceModel.findAll();
            return services.map(service => CatalogEntity.fromObject(service));
        } catch (error) {
            throw CustomError.internalServerError(`Error getting services: ${error}`);
        }
    }

    public async getServiceById(id: string) {
        try {
            const service = await ServiceModel.findById(id);
            if (!service) {
                throw CustomError.notFound('Service not found');
            }
            return CatalogEntity.fromObject(service);
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error getting service: ${error}`);
        }
    }

    public async updateService(id: string, updateDto: UpdateCatalogDto) {
        try {
            const existing = await ServiceModel.findById(id);
            if (!existing) {
                throw CustomError.notFound('Service not found');
            }
            if (updateDto.title && updateDto.title !== existing.title) {
                const existingTitle = await ServiceModel.findByTitle(updateDto.title);
                if (existingTitle) {
                    throw CustomError.conflict('Service with this title already exists');
                }
            }
            const updated = await ServiceModel.update(id, { title: updateDto.title });
            if (!updated) {
                throw CustomError.notFound('Service not found');
            }
            return CatalogEntity.fromObject(updated);
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error updating service: ${error}`);
        }
    }

    public async deleteService(id: string) {
        try {
            const existing = await ServiceModel.findById(id);
            if (!existing) {
                throw CustomError.notFound('Service not found');
            }
            const deleted = await ServiceModel.delete(id);
            if (!deleted) {
                throw CustomError.notFound('Service not found');
            }
            return { message: 'Service deleted successfully' };
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error deleting service: ${error}`);
        }
    }

    // Lead Status
    public async createLeadStatus(createDto: CreateCatalogDto) {
        try {
            const existing = await LeadStatusModel.findByTitle(createDto.title);
            if (existing) {
                throw CustomError.conflict('Lead status with this title already exists');
            }
            const status = await LeadStatusModel.create({ title: createDto.title });
            return CatalogEntity.fromObject(status);
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error creating lead status: ${error}`);
        }
    }

    public async getAllLeadStatus() {
        try {
            const statuses = await LeadStatusModel.findAll();
            return statuses.map(status => CatalogEntity.fromObject(status));
        } catch (error) {
            throw CustomError.internalServerError(`Error getting lead status: ${error}`);
        }
    }

    public async getLeadStatusById(id: string) {
        try {
            const status = await LeadStatusModel.findById(id);
            if (!status) {
                throw CustomError.notFound('Lead status not found');
            }
            return CatalogEntity.fromObject(status);
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error getting lead status: ${error}`);
        }
    }

    public async updateLeadStatus(id: string, updateDto: UpdateCatalogDto) {
        try {
            const existing = await LeadStatusModel.findById(id);
            if (!existing) {
                throw CustomError.notFound('Lead status not found');
            }
            if (updateDto.title && updateDto.title !== existing.title) {
                const existingTitle = await LeadStatusModel.findByTitle(updateDto.title);
                if (existingTitle) {
                    throw CustomError.conflict('Lead status with this title already exists');
                }
            }
            const updated = await LeadStatusModel.update(id, { title: updateDto.title });
            if (!updated) {
                throw CustomError.notFound('Lead status not found');
            }
            return CatalogEntity.fromObject(updated);
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error updating lead status: ${error}`);
        }
    }

    public async deleteLeadStatus(id: string) {
        try {
            const existing = await LeadStatusModel.findById(id);
            if (!existing) {
                throw CustomError.notFound('Lead status not found');
            }
            const deleted = await LeadStatusModel.delete(id);
            if (!deleted) {
                throw CustomError.notFound('Lead status not found');
            }
            return { message: 'Lead status deleted successfully' };
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error deleting lead status: ${error}`);
        }
    }

    // Roles
    public async createRole(createDto: CreateCatalogDto) {
        try {
            const existing = await RoleModel.findByTitle(createDto.title);
            if (existing) {
                throw CustomError.conflict('Role with this title already exists');
            }
            const role = await RoleModel.create({ title: createDto.title });
            return CatalogEntity.fromObject(role);
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error creating role: ${error}`);
        }
    }

    public async getAllRoles() {
        try {
            const roles = await RoleModel.findAll();
            return roles.map(role => CatalogEntity.fromObject(role));
        } catch (error) {
            throw CustomError.internalServerError(`Error getting roles: ${error}`);
        }
    }

    public async getRoleById(id: string) {
        try {
            const role = await RoleModel.findById(id);
            if (!role) {
                throw CustomError.notFound('Role not found');
            }
            return CatalogEntity.fromObject(role);
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error getting role: ${error}`);
        }
    }

    public async updateRole(id: string, updateDto: UpdateCatalogDto) {
        try {
            const existing = await RoleModel.findById(id);
            if (!existing) {
                throw CustomError.notFound('Role not found');
            }
            if (updateDto.title && updateDto.title !== existing.title) {
                const existingTitle = await RoleModel.findByTitle(updateDto.title);
                if (existingTitle) {
                    throw CustomError.conflict('Role with this title already exists');
                }
            }
            const updated = await RoleModel.update(id, { title: updateDto.title });
            if (!updated) {
                throw CustomError.notFound('Role not found');
            }
            return CatalogEntity.fromObject(updated);
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error updating role: ${error}`);
        }
    }

    public async deleteRole(id: string) {
        try {
            const existing = await RoleModel.findById(id);
            if (!existing) {
                throw CustomError.notFound('Role not found');
            }
            const deleted = await RoleModel.delete(id);
            if (!deleted) {
                throw CustomError.notFound('Role not found');
            }
            return { message: 'Role deleted successfully' };
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error deleting role: ${error}`);
        }
    }
}

