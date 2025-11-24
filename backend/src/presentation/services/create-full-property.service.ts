import { PostgresDatabase } from '../../data/postgres/database';
import { 
    CountryModel, 
    CityModel, 
    DepartmentModel, 
    AddressModel, 
    PropertyModel, 
    PropertyImageModel 
} from '../../data/postgres/models';
import { 
    CreateFullPropertyDto, 
    CustomError, 
    FileUploadAdapter 
} from '../../domain';

export class CreateFullPropertyService {
    constructor(
        private readonly fileUploadAdapter: FileUploadAdapter
    ) {}

    async createFullProperty(
        createDto: CreateFullPropertyDto,
        ownerId: string
    ): Promise<{ property_id: string }> {
        const client = PostgresDatabase.getClient();
        
        // Iniciar transacción
        await client.query('BEGIN');

        try {
            // Paso 1: Get or Create Country
            let country = await CountryModel.findByTitle(createDto.location.country);
            if (!country) {
                country = await CountryModel.create({ title: createDto.location.country });
            }
            const countryId = country.id!;

            // Paso 2: Get or Create City
            let city = await CityModel.findByCountryAndTitle(countryId, createDto.location.city);
            if (!city) {
                city = await CityModel.create({
                    title: createDto.location.city,
                    id_country: countryId
                });
            }
            const cityId = city.id!;

            // Paso 3: Get or Create Department
            let department = await DepartmentModel.findByCityAndTitle(cityId, createDto.location.department);
            if (!department) {
                department = await DepartmentModel.create({
                    title: createDto.location.department,
                    id_city: cityId
                });
            }
            const departmentId = department.id!;

            // Paso 4: Subir imagen a Cloudinary
            let imageUrl = createDto.image_url;
            
            // Prioridad: property_file (archivo real) > image_file (base64) > image_url
            if (createDto.property_file && !imageUrl) {
                // Archivo real subido con multer
                try {
                    imageUrl = await this.fileUploadAdapter.uploadFile(createDto.property_file, {
                        folder: 'properties',
                        resourceType: 'image'
                    });
                } catch (error) {
                    await client.query('ROLLBACK');
                    throw CustomError.internalServerError(`Error uploading image: ${error}`);
                }
            } else if (createDto.image_file && !imageUrl) {
                // Base64 string (compatibilidad con versión anterior)
                try {
                    // Convertir base64 a Buffer si es necesario
                    const base64Data = createDto.image_file.replace(/^data:image\/\w+;base64,/, '');
                    const imageBuffer = Buffer.from(base64Data, 'base64');
                    
                    imageUrl = await this.fileUploadAdapter.uploadFile(imageBuffer, {
                        folder: 'properties',
                        resourceType: 'image'
                    });
                } catch (error) {
                    await client.query('ROLLBACK');
                    throw CustomError.internalServerError(`Error uploading image: ${error}`);
                }
            }

            if (!imageUrl) {
                await client.query('ROLLBACK');
                throw CustomError.badRequest('Image URL is required');
            }

            // Paso 5: Create Address
            const address = await AddressModel.create({
                street: createDto.location.street,
                number: createDto.location.number,
                id_department: departmentId
            });
            const addressId = address.id!;

            // Paso 6: Create Property
            const property = await PropertyModel.create({
                title: createDto.propertyDetails.title,
                description: createDto.propertyDetails.description,
                price: createDto.propertyDetails.price,
                bedrooms: createDto.propertyDetails.bedrooms,
                bathrooms: createDto.propertyDetails.bathrooms,
                owner_id: ownerId,
                address_id: addressId,
                status_id: createDto.propertyDetails.status_id,
                property_type_id: createDto.propertyDetails.property_type_id,
                operation_type_id: createDto.propertyDetails.operation_type_id
            });
            const propertyId = property.id!;

            // Paso 7: Create PropertyImage
            await PropertyImageModel.create({
                property_id: propertyId,
                image_url: imageUrl,
                is_primary: true
            });

            // Commit transacción
            await client.query('COMMIT');

            return { property_id: propertyId };
        } catch (error) {
            // Rollback en caso de error
            await client.query('ROLLBACK');
            
            if (error instanceof CustomError) {
                throw error;
            }
            
            throw CustomError.internalServerError(`Error creating full property: ${error}`);
        }
    }
}

