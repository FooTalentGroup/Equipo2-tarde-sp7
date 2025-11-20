import { CountryModel, CityModel, DepartmentModel } from "../../data/postgres/models";
import { CatalogEntity, CustomError, CreateCatalogDto, UpdateCatalogDto, CreateCityDto, UpdateCityDto, CreateDepartmentDto, UpdateDepartmentDto } from "../../domain";

export class LocationServices {
    // Countries
    public async createCountry(createDto: CreateCatalogDto) {
        try {
            // Verificar que no exista un país con el mismo título
            const existing = await CountryModel.findByTitle(createDto.title);
            if (existing) {
                throw CustomError.conflict('Country with this title already exists');
            }
            
            const country = await CountryModel.create({ title: createDto.title });
            return CatalogEntity.fromObject(country);
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error creating country: ${error}`);
        }
    }

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

    public async updateCountry(id: string, updateDto: UpdateCatalogDto) {
        try {
            const existing = await CountryModel.findById(id);
            if (!existing) {
                throw CustomError.notFound('Country not found');
            }
            
            if (updateDto.title && updateDto.title !== existing.title) {
                const existingTitle = await CountryModel.findByTitle(updateDto.title);
                if (existingTitle) {
                    throw CustomError.conflict('Country with this title already exists');
                }
            }
            
            const updated = await CountryModel.update(id, { title: updateDto.title });
            if (!updated) {
                throw CustomError.notFound('Country not found');
            }
            return CatalogEntity.fromObject(updated);
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error updating country: ${error}`);
        }
    }

    public async deleteCountry(id: string) {
        try {
            const existing = await CountryModel.findById(id);
            if (!existing) {
                throw CustomError.notFound('Country not found');
            }
            
            const deleted = await CountryModel.delete(id);
            if (!deleted) {
                throw CustomError.notFound('Country not found');
            }
            return { message: 'Country deleted successfully' };
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error deleting country: ${error}`);
        }
    }

    // Cities
    public async createCity(createDto: CreateCityDto) {
        try {
            // Verificar que el país existe
            const country = await CountryModel.findById(createDto.id_country);
            if (!country) {
                throw CustomError.notFound('Country not found');
            }
            
            const city = await CityModel.create({
                title: createDto.title,
                id_country: createDto.id_country
            });
            return CatalogEntity.fromObject(city);
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error creating city: ${error}`);
        }
    }

    public async getAllCities() {
        try {
            const cities = await CityModel.findAll();
            return cities.map(city => CatalogEntity.fromObject(city));
        } catch (error) {
            throw CustomError.internalServerError(`Error getting cities: ${error}`);
        }
    }

    public async getCitiesByCountry(countryId: string) {
        try {
            const country = await CountryModel.findById(countryId);
            if (!country) {
                throw CustomError.notFound('Country not found');
            }
            
            const cities = await CityModel.findByCountry(countryId);
            return cities.map(city => CatalogEntity.fromObject(city));
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
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

    public async updateCity(id: string, updateDto: UpdateCityDto) {
        try {
            const existing = await CityModel.findById(id);
            if (!existing) {
                throw CustomError.notFound('City not found');
            }
            
            if (updateDto.id_country) {
                const country = await CountryModel.findById(updateDto.id_country);
                if (!country) {
                    throw CustomError.notFound('Country not found');
                }
            }
            
            const updated = await CityModel.update(id, {
                title: updateDto.title,
                id_country: updateDto.id_country
            });
            if (!updated) {
                throw CustomError.notFound('City not found');
            }
            return CatalogEntity.fromObject(updated);
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error updating city: ${error}`);
        }
    }

    public async deleteCity(id: string) {
        try {
            const existing = await CityModel.findById(id);
            if (!existing) {
                throw CustomError.notFound('City not found');
            }
            
            const deleted = await CityModel.delete(id);
            if (!deleted) {
                throw CustomError.notFound('City not found');
            }
            return { message: 'City deleted successfully' };
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error deleting city: ${error}`);
        }
    }

    // Departments
    public async createDepartment(createDto: CreateDepartmentDto) {
        try {
            // Verificar que la ciudad existe
            const city = await CityModel.findById(createDto.id_city);
            if (!city) {
                throw CustomError.notFound('City not found');
            }
            
            const department = await DepartmentModel.create({
                title: createDto.title,
                id_city: createDto.id_city
            });
            return CatalogEntity.fromObject(department);
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error creating department: ${error}`);
        }
    }

    public async getAllDepartments() {
        try {
            const departments = await DepartmentModel.findAll();
            return departments.map(dept => CatalogEntity.fromObject(dept));
        } catch (error) {
            throw CustomError.internalServerError(`Error getting departments: ${error}`);
        }
    }

    public async getDepartmentsByCity(cityId: string) {
        try {
            const city = await CityModel.findById(cityId);
            if (!city) {
                throw CustomError.notFound('City not found');
            }
            
            const departments = await DepartmentModel.findByCity(cityId);
            return departments.map(dept => CatalogEntity.fromObject(dept));
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
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

    public async updateDepartment(id: string, updateDto: UpdateDepartmentDto) {
        try {
            const existing = await DepartmentModel.findById(id);
            if (!existing) {
                throw CustomError.notFound('Department not found');
            }
            
            if (updateDto.id_city) {
                const city = await CityModel.findById(updateDto.id_city);
                if (!city) {
                    throw CustomError.notFound('City not found');
                }
            }
            
            const updated = await DepartmentModel.update(id, {
                title: updateDto.title,
                id_city: updateDto.id_city
            });
            if (!updated) {
                throw CustomError.notFound('Department not found');
            }
            return CatalogEntity.fromObject(updated);
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error updating department: ${error}`);
        }
    }

    public async deleteDepartment(id: string) {
        try {
            const existing = await DepartmentModel.findById(id);
            if (!existing) {
                throw CustomError.notFound('Department not found');
            }
            
            const deleted = await DepartmentModel.delete(id);
            if (!deleted) {
                throw CustomError.notFound('Department not found');
            }
            return { message: 'Department deleted successfully' };
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error deleting department: ${error}`);
        }
    }
}

