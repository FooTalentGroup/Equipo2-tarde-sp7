import { RentalModel, PropertyModel, ClientModel } from "../../data/postgres/models";
import { RentalEntity, CreateRentalDto, CustomError, UpdateRentalDto, ValidatePropertyAvailabilityUseCase } from "../../domain";

export class RentalServices {
    public async createRental(createRentalDto: CreateRentalDto) {
        try {
            // Verificar que la propiedad existe
            const property = await PropertyModel.findById(createRentalDto.property_id);
            if (!property) {
                throw CustomError.notFound('Property not found');
            }
            
            // Verificar que el cliente existe
            const client = await ClientModel.findById(createRentalDto.client_id);
            if (!client) {
                throw CustomError.notFound('Client not found');
            }
            
            // Verificar disponibilidad de la propiedad
            const existingRentals = await RentalModel.findActiveByProperty(
                createRentalDto.property_id,
                createRentalDto.start_date
            );
            
            const availability = ValidatePropertyAvailabilityUseCase.execute(
                createRentalDto.start_date,
                createRentalDto.end_date,
                existingRentals.map(r => ({
                    start_date: r.start_date instanceof Date ? r.start_date : new Date(r.start_date),
                    end_date: r.end_date instanceof Date ? r.end_date : new Date(r.end_date)
                }))
            );
            
            if (!availability.isAvailable) {
                throw CustomError.conflict(availability.reason || 'Property is not available for the selected dates');
            }
            
            const rental = await RentalModel.create({
                property_id: createRentalDto.property_id,
                client_id: createRentalDto.client_id,
                start_date: createRentalDto.start_date,
                end_date: createRentalDto.end_date
            });

            return RentalEntity.fromObject(rental);
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error creating rental: ${error}`);
        }
    }

    public async getRentalById(id: string) {
        try {
            const rental = await RentalModel.findById(id);
            if (!rental) {
                throw CustomError.notFound('Rental not found');
            }
            return RentalEntity.fromObject(rental);
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error getting rental: ${error}`);
        }
    }

    public async getAllRentals() {
        try {
            const rentals = await RentalModel.findAll();
            return rentals.map(rental => RentalEntity.fromObject(rental));
        } catch (error) {
            throw CustomError.internalServerError(`Error getting rentals: ${error}`);
        }
    }

    public async getRentalsByProperty(propertyId: string) {
        try {
            const property = await PropertyModel.findById(propertyId);
            if (!property) {
                throw CustomError.notFound('Property not found');
            }
            const rentals = await RentalModel.findByProperty(propertyId);
            return rentals.map(rental => RentalEntity.fromObject(rental));
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error getting rentals by property: ${error}`);
        }
    }

    public async getRentalsByClient(clientId: string) {
        try {
            const client = await ClientModel.findById(clientId);
            if (!client) {
                throw CustomError.notFound('Client not found');
            }
            const rentals = await RentalModel.findByClient(clientId);
            return rentals.map(rental => RentalEntity.fromObject(rental));
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error getting rentals by client: ${error}`);
        }
    }

    public async updateRental(id: string, updateRentalDto: UpdateRentalDto) {
        try {
            const existing = await RentalModel.findById(id);
            if (!existing) {
                throw CustomError.notFound('Rental not found');
            }
            
            if (updateRentalDto.property_id) {
                const property = await PropertyModel.findById(updateRentalDto.property_id);
                if (!property) {
                    throw CustomError.notFound('Property not found');
                }
            }
            
            if (updateRentalDto.client_id) {
                const client = await ClientModel.findById(updateRentalDto.client_id);
                if (!client) {
                    throw CustomError.notFound('Client not found');
                }
            }
            
            // Si se actualizan las fechas, verificar disponibilidad
            if (updateRentalDto.start_date || updateRentalDto.end_date) {
                const startDate = updateRentalDto.start_date || (existing.start_date instanceof Date ? existing.start_date : new Date(existing.start_date));
                const endDate = updateRentalDto.end_date || (existing.end_date instanceof Date ? existing.end_date : new Date(existing.end_date));
                const propertyId = updateRentalDto.property_id || existing.property_id;
                
                const existingRentals = await RentalModel.findActiveByProperty(propertyId, startDate);
                // Excluir el rental actual
                const otherRentals = existingRentals.filter(r => r.id !== id);
                
                const availability = ValidatePropertyAvailabilityUseCase.execute(
                    startDate,
                    endDate,
                    otherRentals.map(r => ({
                        start_date: r.start_date instanceof Date ? r.start_date : new Date(r.start_date),
                        end_date: r.end_date instanceof Date ? r.end_date : new Date(r.end_date)
                    }))
                );
                
                if (!availability.isAvailable) {
                    throw CustomError.conflict(availability.reason || 'Property is not available for the selected dates');
                }
            }
            
            const updated = await RentalModel.update(id, {
                property_id: updateRentalDto.property_id,
                client_id: updateRentalDto.client_id,
                start_date: updateRentalDto.start_date,
                end_date: updateRentalDto.end_date
            });
            
            if (!updated) {
                throw CustomError.notFound('Rental not found');
            }
            return RentalEntity.fromObject(updated);
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error updating rental: ${error}`);
        }
    }

    public async deleteRental(id: string) {
        try {
            const existing = await RentalModel.findById(id);
            if (!existing) {
                throw CustomError.notFound('Rental not found');
            }
            const deleted = await RentalModel.delete(id);
            if (!deleted) {
                throw CustomError.notFound('Rental not found');
            }
            return { message: 'Rental deleted successfully' };
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error deleting rental: ${error}`);
        }
    }
}

