import { AddressModel, DepartmentModel } from "../../data/postgres/models";
import { AddressEntity, CreateAddressDto, CustomError, UpdateAddressDto } from "../../domain";

export class AddressServices {
    public async createAddress(createAddressDto: CreateAddressDto) {
        try {
            // Verificar que el departamento existe
            const department = await DepartmentModel.findById(createAddressDto.id_department);
            if (!department) {
                throw CustomError.notFound('Department not found');
            }
            
            // Crear dirección en la base de datos
            const address = await AddressModel.create({
                street: createAddressDto.street,
                number: createAddressDto.number,
                id_department: createAddressDto.id_department
            });

            // Convertir a Entity
            const addressEntity = AddressEntity.fromObject(address);
            
            return addressEntity;
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error creating address: ${error}`);
        }
    }

    public async getAllAddresses() {
        try {
            const addresses = await AddressModel.findAll();
            return addresses.map(address => AddressEntity.fromObject(address));
        } catch (error) {
            throw CustomError.internalServerError(`Error getting addresses: ${error}`);
        }
    }

    public async getAddressById(id: string) {
        try {
            const address = await AddressModel.findById(id);
            if (!address) {
                throw CustomError.notFound('Address not found');
            }
            
            const addressEntity = AddressEntity.fromObject(address);
            return addressEntity;
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error getting address: ${error}`);
        }
    }

    public async getAddressesByDepartment(departmentId: string) {
        try {
            // Verificar que el departamento existe
            const department = await DepartmentModel.findById(departmentId);
            if (!department) {
                throw CustomError.notFound('Department not found');
            }
            
            const addresses = await AddressModel.findByDepartment(departmentId);
            return addresses.map(address => AddressEntity.fromObject(address));
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error getting addresses by department: ${error}`);
        }
    }

    public async updateAddress(id: string, updateAddressDto: UpdateAddressDto) {
        try {
            // Verificar que la dirección existe
            const existingAddress = await AddressModel.findById(id);
            if (!existingAddress) {
                throw CustomError.notFound('Address not found');
            }
            
            // Verificar que el departamento existe (si se está actualizando)
            if (updateAddressDto.id_department) {
                const department = await DepartmentModel.findById(updateAddressDto.id_department);
                if (!department) {
                    throw CustomError.notFound('Department not found');
                }
            }
            
            // Actualizar dirección
            const updatedAddress = await AddressModel.update(id, {
                street: updateAddressDto.street,
                number: updateAddressDto.number,
                id_department: updateAddressDto.id_department
            });
            
            if (!updatedAddress) {
                throw CustomError.notFound('Address not found');
            }
            
            const addressEntity = AddressEntity.fromObject(updatedAddress);
            return addressEntity;
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error updating address: ${error}`);
        }
    }

    public async deleteAddress(id: string) {
        try {
            // Verificar que la dirección existe
            const existingAddress = await AddressModel.findById(id);
            if (!existingAddress) {
                throw CustomError.notFound('Address not found');
            }
            
            const deleted = await AddressModel.delete(id);
            if (!deleted) {
                throw CustomError.notFound('Address not found');
            }
            
            return { message: 'Address deleted successfully' };
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error deleting address: ${error}`);
        }
    }
}

