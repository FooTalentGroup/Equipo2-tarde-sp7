import { PropertyImageModel, PropertyModel } from "../../data/postgres/models";
import { PropertyImageEntity, CreatePropertyImageDto, CustomError } from "../../domain";

export class PropertyImageServices {
    public async createPropertyImage(createPropertyImageDto: CreatePropertyImageDto) {
        try {
            // Verificar que la propiedad existe
            const property = await PropertyModel.findById(createPropertyImageDto.property_id);
            if (!property) {
                throw CustomError.notFound('Property not found');
            }
            
            // Crear imagen en la base de datos
            const image = await PropertyImageModel.create({
                property_id: createPropertyImageDto.property_id,
                image_url: createPropertyImageDto.image_url,
                is_primary: createPropertyImageDto.is_primary
            });

            // Convertir a Entity
            const imageEntity = PropertyImageEntity.fromObject(image);
            
            return imageEntity;
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error creating property image: ${error}`);
        }
    }

    public async getPropertyImages(propertyId: string) {
        try {
            // Verificar que la propiedad existe
            const property = await PropertyModel.findById(propertyId);
            if (!property) {
                throw CustomError.notFound('Property not found');
            }
            
            const images = await PropertyImageModel.findByProperty(propertyId);
            return images.map(image => PropertyImageEntity.fromObject(image));
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error getting property images: ${error}`);
        }
    }

    public async getPropertyImageById(id: string) {
        try {
            const image = await PropertyImageModel.findById(id);
            if (!image) {
                throw CustomError.notFound('Property image not found');
            }
            
            const imageEntity = PropertyImageEntity.fromObject(image);
            return imageEntity;
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error getting property image: ${error}`);
        }
    }

    public async setPrimaryImage(id: string) {
        try {
            const image = await PropertyImageModel.setAsPrimary(id);
            if (!image) {
                throw CustomError.notFound('Property image not found');
            }
            
            const imageEntity = PropertyImageEntity.fromObject(image);
            return imageEntity;
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error setting primary image: ${error}`);
        }
    }

    public async deletePropertyImage(id: string) {
        try {
            // Verificar que la imagen existe
            const existingImage = await PropertyImageModel.findById(id);
            if (!existingImage) {
                throw CustomError.notFound('Property image not found');
            }
            
            const deleted = await PropertyImageModel.delete(id);
            if (!deleted) {
                throw CustomError.notFound('Property image not found');
            }
            
            return { message: 'Property image deleted successfully' };
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServerError(`Error deleting property image: ${error}`);
        }
    }
}

