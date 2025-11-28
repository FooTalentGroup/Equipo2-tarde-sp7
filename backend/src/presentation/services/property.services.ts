    import { TransactionHelper } from '../../data/postgres/transaction.helper';
    import { 
        PropertyModel, 
        AddressModel, 
        PropertyAddressModel,
        PropertyPriceModel,
        PropertyMultimediaModel,
        PropertyDocumentModel,
        CatalogServiceModel,
        PropertyServiceModel,
        ExpenseModel,
        CountryModel,
        ProvinceModel,
        CityModel,
        ClientModel,
        CurrencyTypeModel,
        PropertyOperationTypeModel,
        PropertyTypeModel,
        PropertyStatusModel,
        VisibilityStatusModel,
        PropertySituationModel,
        PropertyAgeModel,
        OrientationModel,
        DispositionModel
    } from '../../data/postgres/models';
    import { CreatePropertyDto, CreatePropertyGroupedDto } from '../../domain/dtos/properties';
    import { CustomError } from '../../domain';
    import { FileUploadAdapter } from '../../domain/interfaces/file-upload.adapter';

    /**
     * Service for handling property operations
     * Uses transactions to ensure atomicity
     */
    export class PropertyServices {
        constructor(
            private readonly fileUploadAdapter: FileUploadAdapter
        ) {}

        /**
         * Crea una propiedad completa con todas sus relaciones
         * TODO EN UNA TRANSACCIÓN: Si falla cualquier paso, se revierte todo
         * 
         * Pasos:
         * 1. Validar/obtener geografía (country -> province -> city)
         * 2. Crear dirección
         * 3. Crear propiedad
         * 4. Vincular dirección con propiedad
         * 5. Crear precios
         * 6. Subir imágenes a Cloudinary
         * 7. Crear registros de multimedia
         * 
         * Si cualquier paso falla, se hace ROLLBACK de todo
         */
        async createProperty(
            createPropertyDto: CreatePropertyDto,
            capturedByUserId: number,
            images?: Express.Multer.File[]
        ) {
            return await TransactionHelper.executeInTransaction(async () => {

                let ownerClient = null;
                let finalOwnerId: number | null = null;
                if (createPropertyDto.owner_id) {
                    // Si viene owner_id, validar que existe y es válido
                    if (isNaN(Number(createPropertyDto.owner_id)) || Number(createPropertyDto.owner_id) <= 0) {
                        throw CustomError.badRequest('owner_id must be a valid positive number.');
                    }
                }
                // 0. Validar que el owner (cliente propietario) existe y es de categoría "Propietario"
                // (!createPropertyDto.owner_id) {
                //  throw CustomError.badRequest('owner_id is required. Please specify a client (propietario) for this property.');
            //
                
                ownerClient = await ClientModel.findById(createPropertyDto.owner_id!);
                if (!ownerClient) {
                    throw CustomError.badRequest(`Client with ID ${createPropertyDto.owner_id} not found. Please create a client first.`);
                }
                
                // Verificar que el cliente sea de categoría "Propietario" (opcional pero recomendado)
                const { ContactCategoryModel } = await import('../../data/postgres/models/clients/contact-category.model');
                if (ownerClient.contact_category_id) {
                    const category = await ContactCategoryModel.findById(ownerClient.contact_category_id);
                    // No bloqueamos si no es "Propietario", pero es recomendado
                    // Puedes descomentar esto si quieres forzar que sea "Propietario"
                    // if (category && category.name !== 'Propietario') {
                    //     throw CustomError.badRequest(`Client with ID ${createPropertyDto.owner_id} is not a "Propietario". Only clients with category "Propietario" can own properties.`);
                    // }
                }
                
                finalOwnerId = createPropertyDto.owner_id;

                // 1. Obtener/validar geografía (country -> province -> city)
                const geography = await this.resolveGeography(
                    createPropertyDto.geography
                );

                // 2. Crear dirección
                const fullAddress = this.buildFullAddress(createPropertyDto.address);
                const address = await AddressModel.create({
                    full_address: fullAddress,
                    neighborhood: createPropertyDto.address.neighborhood,
                    postal_code: createPropertyDto.address.postal_code,
                    latitude: createPropertyDto.address.latitude,
                    longitude: createPropertyDto.address.longitude,
                    city_id: geography.cityId,
                });

                // 3. Resolver IDs de catálogos si se enviaron nombres
                const propertyTypeId = await this.resolveCatalogId(
                    createPropertyDto.property_type_id,
                    createPropertyDto.property_type,
                    PropertyTypeModel,
                    'Property type'
                );

                const propertyStatusId = await this.resolveCatalogId(
                    createPropertyDto.property_status_id,
                    createPropertyDto.property_status,
                    PropertyStatusModel,
                    'Property status'
                );

                const visibilityStatusId = await this.resolveCatalogId(
                    createPropertyDto.visibility_status_id,
                    createPropertyDto.visibility_status,
                    VisibilityStatusModel,
                    'Visibility status'
                );

                // Resolver opcionales
                const situationId = createPropertyDto.situation_id 
                    ? createPropertyDto.situation_id 
                    : createPropertyDto.situation 
                        ? await this.resolveCatalogIdByName(createPropertyDto.situation, PropertySituationModel, 'Situation')
                        : undefined;

                const ageId = createPropertyDto.age_id
                    ? createPropertyDto.age_id
                    : createPropertyDto.age
                        ? await this.resolveCatalogIdByName(createPropertyDto.age, PropertyAgeModel, 'Age')
                        : undefined;

                const orientationId = createPropertyDto.orientation_id
                    ? createPropertyDto.orientation_id
                    : createPropertyDto.orientation
                        ? await this.resolveCatalogIdByName(createPropertyDto.orientation, OrientationModel, 'Orientation')
                        : undefined;

                const dispositionId = createPropertyDto.disposition_id
                    ? createPropertyDto.disposition_id
                    : createPropertyDto.disposition
                        ? await this.resolveCatalogIdByName(createPropertyDto.disposition, DispositionModel, 'Disposition')
                        : undefined;

                // 4. Crear propiedad
                // Convertir publication_date a Date si viene como string
                let publicationDate: Date | undefined = undefined;
                if (createPropertyDto.publication_date) {
                    if (typeof createPropertyDto.publication_date === 'string') {
                        publicationDate = new Date(createPropertyDto.publication_date);
                    } else {
                        publicationDate = createPropertyDto.publication_date;
                    }
                }

                const property = await PropertyModel.create({
                    title: createPropertyDto.title,
                    description: createPropertyDto.description,
                    publication_date: publicationDate,
                    featured_web: createPropertyDto.featured_web,
                    property_type_id: propertyTypeId,
                    property_status_id: propertyStatusId,
                    visibility_status_id: visibilityStatusId,
                    owner_id: finalOwnerId,
                    captured_by_user_id: capturedByUserId,
                    bedrooms_count: createPropertyDto.bedrooms_count,
                    bathrooms_count: createPropertyDto.bathrooms_count,
                    rooms_count: createPropertyDto.rooms_count,
                    toilets_count: createPropertyDto.toilets_count,
                    parking_spaces_count: createPropertyDto.parking_spaces_count,
                    floors_count: createPropertyDto.floors_count,
                    land_area: createPropertyDto.land_area,
                    semi_covered_area: createPropertyDto.semi_covered_area,
                    covered_area: createPropertyDto.covered_area,
                    total_built_area: createPropertyDto.total_built_area,
                    uncovered_area: createPropertyDto.uncovered_area,
                    total_area: createPropertyDto.total_area,
                    zoning: createPropertyDto.zoning,
                    situation_id: situationId,
                    age_id: ageId,
                    orientation_id: orientationId,
                    disposition_id: dispositionId,
                    branch_name: createPropertyDto.branch_name,
                    appraiser: createPropertyDto.appraiser,
                    producer: createPropertyDto.producer,
                    maintenance_user: createPropertyDto.maintenance_user,
                    keys_location: createPropertyDto.keys_location,
                    internal_comments: createPropertyDto.internal_comments,
                    social_media_info: createPropertyDto.social_media_info,
                    operation_commission_percentage: createPropertyDto.operation_commission_percentage,
                    producer_commission_percentage: createPropertyDto.producer_commission_percentage,
                });

                if (!property.id) {
                    throw CustomError.internalServerError('Failed to create property');
                }

                // 5. Vincular dirección con propiedad
                await PropertyAddressModel.create({
                    property_id: property.id,
                    address_id: address.id!,
                });

                // 6. Crear precios (resolver IDs si se enviaron símbolos/nombres)
                const prices = [];
                for (const priceDto of createPropertyDto.prices) {
                    // Resolver currency_type_id si se envió símbolo
                    let currencyTypeId = priceDto.currency_type_id;
                    if (!currencyTypeId && priceDto.currency_symbol) {
                        const currencyType = await CurrencyTypeModel.findBySymbol(priceDto.currency_symbol);
                        if (!currencyType || !currencyType.id) {
                            throw CustomError.badRequest(
                                `Currency symbol "${priceDto.currency_symbol}" not found. Valid symbols: ARS, USD, EUR`
                            );
                        }
                        currencyTypeId = currencyType.id;
                    }

                    // Resolver operation_type_id si se envió nombre
                    let operationTypeId = priceDto.operation_type_id;
                    if (!operationTypeId && priceDto.operation_type) {
                        const operationType = await PropertyOperationTypeModel.findByName(priceDto.operation_type);
                        if (!operationType || !operationType.id) {
                            throw CustomError.badRequest(
                                `Operation type "${priceDto.operation_type}" not found. Valid types: Venta, Alquiler, Alquiler Temporal`
                            );
                        }
                        operationTypeId = operationType.id;
                    }

                    if (!currencyTypeId || !operationTypeId) {
                        throw CustomError.badRequest('Failed to resolve currency or operation type');
                    }

                    const price = await PropertyPriceModel.create({
                        property_id: property.id,
                        price: priceDto.price,
                        currency_type_id: currencyTypeId,
                        operation_type_id: operationTypeId,
                    });
                    prices.push(price);
                }

                // 7. Subir imágenes y crear registros de multimedia
                const uploadedImages: string[] = [];
                const multimediaRecords = [];

                if (images && images.length > 0) {
                    try {
                        // Subir todas las imágenes a Cloudinary
                        for (let i = 0; i < images.length; i++) {
                            const image = images[i];
                            const imageUrl = await this.fileUploadAdapter.uploadFile(
                                image.buffer,
                                {
                                    folder: `properties/${property.id}`,
                                    resourceType: 'image',
                                }
                            );
                            uploadedImages.push(imageUrl);

                            // Crear registro de multimedia
                            const multimedia = await PropertyMultimediaModel.create({
                                property_id: property.id,
                                file_path: imageUrl,
                                media_type: image.mimetype || 'image/jpeg',
                                is_primary: i === 0, // Primera imagen es primary
                            });
                            multimediaRecords.push(multimedia);
                        }
                    } catch (error: any) {
                        // Si falla la subida de imágenes, la transacción hará ROLLBACK
                        // Pero también intentamos limpiar las imágenes subidas a Cloudinary
                        for (const url of uploadedImages) {
                            try {
                                await this.fileUploadAdapter.deleteFile(url);
                            } catch (deleteError) {
                                console.error('Error deleting uploaded image from Cloudinary:', deleteError);
                            }
                        }
                        throw CustomError.internalServerError(`Error uploading images: ${error.message}`);
                    }
                }

                // Enriquecer respuesta con nombres de catálogos y datos del propietario
                // Reutilizar el owner ya obtenido arriba, solo necesitamos obtener los catálogos
                const [
                    propertyType,
                    propertyStatus,
                    visibilityStatus,
                    addressCity
                ] = await Promise.all([
                    PropertyTypeModel.findById(propertyTypeId),
                    PropertyStatusModel.findById(propertyStatusId),
                    VisibilityStatusModel.findById(visibilityStatusId),
                    CityModel.findById(geography.cityId)
                ]);

                const addressProvince = addressCity ? await ProvinceModel.findById(addressCity.province_id) : null;
                const addressCountry = addressProvince ? await CountryModel.findById(addressProvince.country_id) : null;

                // Enriquecer precios con moneda y tipo de operación
                const enrichedPrices = await Promise.all(
                    prices.map(async (price: any) => {
                        const [currency, operationType] = await Promise.all([
                            CurrencyTypeModel.findById(price.currency_type_id),
                            PropertyOperationTypeModel.findById(price.operation_type_id)
                        ]);
                        
                        return {
                            id: price.id,
                            property_id: price.property_id,
                            price: price.price,
                            currency: currency ? {
                                id: currency.id,
                                name: currency.name,
                                symbol: currency.symbol
                            } : null,
                            operation_type: operationType ? {
                                id: operationType.id,
                                name: operationType.name
                            } : null,
                            updated_at: price.updated_at
                        };
                    })
                );

                // Retornar propiedad completa con TODOS los campos (incluyendo nulls)
                // Incluimos objetos enriquecidos completos, no solo IDs
                return {
                    property: {
                        ...property,
                        // Catálogos principales enriquecidos (objetos completos, no solo IDs)
                        property_type: propertyType ? {
                            id: propertyType.id,
                            name: propertyType.name
                        } : null,
                        property_status: propertyStatus ? {
                            id: propertyStatus.id,
                            name: propertyStatus.name
                        } : null,
                        visibility_status: visibilityStatus ? {
                            id: visibilityStatus.id,
                            name: visibilityStatus.name
                        } : null,
                        // Owner enriquecido (objeto completo, no solo ID)
                        owner: ownerClient ? {
                            id: ownerClient.id,
                            first_name: ownerClient.first_name,
                            last_name: ownerClient.last_name,
                            name: `${ownerClient.first_name} ${ownerClient.last_name}`,
                            email: ownerClient.email || null,
                            phone: ownerClient.phone || null,
                            dni: ownerClient.dni || null
                        } : null,
                        // Dirección enriquecida (objeto completo con ciudad, provincia, país)
                        address: {
                            id: address.id,
                            full_address: address.full_address,
                            neighborhood: address.neighborhood || null,
                            postal_code: address.postal_code || null,
                            latitude: address.latitude || null,
                            longitude: address.longitude || null,
                            city: addressCity ? {
                                id: addressCity.id,
                                name: addressCity.name,
                                province: addressProvince ? {
                                    id: addressProvince.id,
                                    name: addressProvince.name,
                                    country: addressCountry ? {
                                        id: addressCountry.id,
                                        name: addressCountry.name
                                    } : null
                                } : null
                            } : null
                        },
                        // Precios enriquecidos (con objetos de moneda y operación completos)
                        prices: enrichedPrices.map((price: any) => ({
                            id: price.id,
                            property_id: price.property_id,
                            price: price.price,
                            currency: price.currency || null,
                            operation_type: price.operation_type || null,
                            updated_at: price.updated_at
                        })),
                        // Imágenes
                        images: multimediaRecords
                    }
                };
            });
        }

        /**
         * Resuelve la geografía: obtiene o crea country, province, city
         * Retorna los IDs necesarios
         * 
         * NOTA: Usa el mismo client de la transacción vía PostgresDatabase.getClient()
         */
        private async resolveGeography(
            geography: CreatePropertyDto['geography']
        ): Promise<{ countryId: number; provinceId: number; cityId: number }> {
            // Obtener o crear país
            let country = await CountryModel.findByName(geography.country);
            if (!country) {
                country = await CountryModel.create({ name: geography.country });
            }
            if (!country.id) {
                throw CustomError.internalServerError('Failed to resolve country');
            }

            // Obtener o crear provincia
            let province = await ProvinceModel.findByName(geography.province);
            if (!province) {
                province = await ProvinceModel.create({
                    name: geography.province,
                    country_id: country.id,
                });
            } else if (province.country_id !== country.id) {
                // Si la provincia existe pero pertenece a otro país, error
                throw CustomError.badRequest(
                    `Province "${geography.province}" belongs to a different country`
                );
            }
            if (!province.id) {
                throw CustomError.internalServerError('Failed to resolve province');
            }

            // Obtener o crear ciudad
            let city = await CityModel.findByNameAndProvince(geography.city, province.id);
            if (!city) {
                city = await CityModel.create({
                    name: geography.city,
                    province_id: province.id,
                });
            }
            if (!city.id) {
                throw CustomError.internalServerError('Failed to resolve city');
            }

            return {
                countryId: country.id,
                provinceId: province.id,
                cityId: city.id,
            };
        }

        /**
         * Construye la dirección completa a partir de los datos
         */
        private buildFullAddress(address: CreatePropertyDto['address']): string {
            const parts: string[] = [];
            
            if (address.street) {
                parts.push(address.street);
            }
            if (address.number) {
                parts.push(address.number);
            }
            if (address.neighborhood) {
                parts.push(address.neighborhood);
            }

            return parts.join(' ').trim() || address.street;
        }

        /**
         * Gets a property by ID with all its complete relations
         * Includes all images, all prices, all addresses with enriched data
         */
        async getPropertyById(id: number, includeArchived: boolean = false) {
            const property = await PropertyModel.findByIdWithRelations(id, includeArchived);
            if (!property) {
                throw CustomError.notFound(`Property with ID ${id} not found`);
            }

            // Enrich with catalog names
            const [
                propertyType,
                propertyStatus,
                visibilityStatus,
                owner,
                age,
                orientation,
                disposition,
                situation
            ] = await Promise.all([
                PropertyTypeModel.findById(property.property_type_id),
                PropertyStatusModel.findById(property.property_status_id),
                VisibilityStatusModel.findById(property.visibility_status_id),
                ClientModel.findById(property.owner_id),
                property.age_id ? PropertyAgeModel.findById(property.age_id) : Promise.resolve(null),
                property.orientation_id ? OrientationModel.findById(property.orientation_id) : Promise.resolve(null),
                property.disposition_id ? DispositionModel.findById(property.disposition_id) : Promise.resolve(null),
                property.situation_id ? PropertySituationModel.findById(property.situation_id) : Promise.resolve(null)
            ]);

            // Enriquecer precios con moneda y tipo de operación
            const enrichedPrices = await Promise.all(
                (property.prices || []).map(async (price: any) => {
                    const [currency, operationType] = await Promise.all([
                        CurrencyTypeModel.findById(price.currency_type_id),
                        PropertyOperationTypeModel.findById(price.operation_type_id)
                    ]);
                    
                    return {
                        id: price.id,
                        property_id: price.property_id,
                        price: price.price,
                        currency: currency ? {
                            id: currency.id,
                            name: currency.name,
                            symbol: currency.symbol
                        } : null,
                        operation_type: operationType ? {
                            id: operationType.id,
                            name: operationType.name
                        } : null,
                        updated_at: price.updated_at
                    };
                })
            );

            // Enrich addresses with city and province
            const enrichedAddresses = await Promise.all(
                (property.addresses || []).map(async (address: any) => {
                    if (!address || !address.city_id) return null;
                    
                    const city = await CityModel.findById(address.city_id);
                    if (!city) return address;
                    
                    const province = await ProvinceModel.findById(city.province_id);
                    const country = province ? await CountryModel.findById(province.country_id) : null;
                    
                    return {
                        id: address.id,
                        full_address: address.full_address,
                        ...(address.neighborhood && { neighborhood: address.neighborhood }),
                        ...(address.postal_code && { postal_code: address.postal_code }),
                        ...(address.latitude && { latitude: address.latitude }),
                        ...(address.longitude && { longitude: address.longitude }),
                        city: {
                            id: city.id,
                            name: city.name,
                            province: province ? {
                                id: province.id,
                                name: province.name,
                                country: country ? {
                                    id: country.id,
                                    name: country.name
                                } : null
                            } : null
                        }
                    };
                })
            );

            // Obtener servicios vinculados
            const propertyServices = await PropertyServiceModel.findByPropertyId(id);
            const enrichedServices = await Promise.all(
                propertyServices.map(async (ps: any) => {
                    const service = await CatalogServiceModel.findById(ps.service_id);
                    return service ? {
                        id: service.id,
                        name: service.name
                    } : null;
                })
            );

            // Obtener documentos
            const documents = await PropertyDocumentModel.findByPropertyId(id);

            // Obtener expensas
            const expenses = await ExpenseModel.findByPropertyId(id);
            const enrichedExpenses = await Promise.all(
                expenses.map(async (expense: any) => {
                    const currency = await CurrencyTypeModel.findById(expense.currency_type_id);
                    return {
                        id: expense.id,
                        property_id: expense.property_id,
                        amount: expense.amount,
                        currency: currency ? {
                            id: currency.id,
                            name: currency.name,
                            symbol: currency.symbol
                        } : null,
                        frequency: expense.frequency || null,
                        registered_date: expense.registered_date
                    };
                })
            );

            // Structure complete response with ALL fields (including nulls)
            // We include enriched objects, not just IDs
            return {
                property: {
                    ...property,
                    // Catálogos principales enriquecidos (objetos completos, no solo IDs)
                    property_type: propertyType ? {
                        id: propertyType.id,
                        name: propertyType.name
                    } : null,
                    property_status: propertyStatus ? {
                        id: propertyStatus.id,
                        name: propertyStatus.name
                    } : null,
                    visibility_status: visibilityStatus ? {
                        id: visibilityStatus.id,
                        name: visibilityStatus.name
                    } : null,
                    // Owner enriquecido (objeto completo, no solo ID)
                    owner: owner ? {
                        id: owner.id,
                        first_name: owner.first_name,
                        last_name: owner.last_name,
                        name: `${owner.first_name} ${owner.last_name}`,
                        email: owner.email || null,
                        phone: owner.phone || null,
                        dni: owner.dni || null
                    } : null,
                    // Catálogos opcionales enriquecidos (objetos completos, no solo IDs)
                    age: age ? {
                        id: age.id,
                        name: age.name
                    } : null,
                    orientation: orientation ? {
                        id: orientation.id,
                        name: orientation.name
                    } : null,
                    disposition: disposition ? {
                        id: disposition.id,
                        name: disposition.name
                    } : null,
                    situation: situation ? {
                        id: situation.id,
                        name: situation.name
                    } : null,
                    // Precios enriquecidos (con objetos de moneda y operación, no solo IDs)
                    prices: enrichedPrices.map((price: any) => ({
                        id: price.id,
                        property_id: price.property_id,
                        price: price.price,
                        currency: price.currency || null,
                        operation_type: price.operation_type || null,
                        updated_at: price.updated_at
                    })),
                    // Direcciones enriquecidas (con objetos de ciudad, provincia, país, no solo IDs)
                    addresses: enrichedAddresses.filter(a => a !== null).map((addr: any) => ({
                        id: addr.id,
                        full_address: addr.full_address,
                        neighborhood: addr.neighborhood || null,
                        postal_code: addr.postal_code || null,
                        latitude: addr.latitude || null,
                        longitude: addr.longitude || null,
                        city: addr.city || null
                    })),
                    // Imágenes
                    images: property.images || [],
                    // Servicios
                    services: enrichedServices.filter(s => s !== null),
                    // Documentos
                    documents: documents,
                    // Expensas
                    expenses: enrichedExpenses
                }
            };
        }

        /**
         * Lists properties with optional filters
         * Returns summarized information: only main image, main price, main address
         */
        async listProperties(filters?: {
            property_type_id?: number;
            property_status_id?: number;
            visibility_status_id?: number;
            owner_id?: number;
            captured_by_user_id?: number;
            city_id?: number;
            min_price?: number;
            max_price?: number;
            operation_type_id?: number;
            currency_type_id?: number;
            featured_web?: boolean;
            search?: string;
            includeArchived?: boolean;
            limit?: number;
            offset?: number;
        }) {
            const properties = await PropertyModel.findAll(filters);
            
            // Enrich with currency and operation type data from main price
            const { CurrencyTypeModel } = await import('../../data/postgres/models/payments/currency-type.model');
            const { PropertyOperationTypeModel } = await import('../../data/postgres/models/properties/property-operation-type.model');
            
            const enrichedProperties = await Promise.all(
                properties.map(async (property: any) => {
                    // Obtener información de moneda y tipo de operación del precio principal
                    let mainPriceInfo = null;
                    if (property.main_price && property.main_currency_type_id && property.main_operation_type_id) {
                        const [currency, operationType] = await Promise.all([
                            CurrencyTypeModel.findById(property.main_currency_type_id),
                            PropertyOperationTypeModel.findById(property.main_operation_type_id)
                        ]);
                        
                        mainPriceInfo = {
                            price: property.main_price,
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
                    }
                    
                    // Structure summarized response
                    return {
                        id: property.id,
                        title: property.title,
                        description: property.description,
                        publication_date: property.publication_date,
                        featured_web: property.featured_web,
                        // Catálogos con nombres
                        property_type: {
                            id: property.property_type_id,
                            name: property.property_type_name
                        },
                        property_status: {
                            id: property.property_status_id,
                            name: property.property_status_name
                        },
                        visibility_status: {
                            id: property.visibility_status_id,
                            name: property.visibility_status_name
                        },
                        // Owner básico
                        owner: {
                            id: property.owner_id,
                            name: property.owner_name,
                            email: property.owner_email,
                            phone: property.owner_phone
                        },
                        // Catálogos opcionales
                        age: property.age_id ? {
                            id: property.age_id,
                            name: property.property_age_name
                        } : null,
                        orientation: property.orientation_id ? {
                            id: property.orientation_id,
                            name: property.orientation_name
                        } : null,
                        disposition: property.disposition_id ? {
                            id: property.disposition_id,
                            name: property.disposition_name
                        } : null,
                        situation: property.situation_id ? {
                            id: property.situation_id,
                            name: property.situation_name
                        } : null,
                        // Características básicas
                        bedrooms_count: property.bedrooms_count,
                        bathrooms_count: property.bathrooms_count,
                        rooms_count: property.rooms_count,
                        parking_spaces_count: property.parking_spaces_count,
                        land_area: property.land_area,
                        covered_area: property.covered_area,
                        total_area: property.total_area,
                        // Precio principal
                        main_price: mainPriceInfo,
                        // Dirección principal
                        main_address: property.main_address ? {
                            full_address: property.main_address,
                            neighborhood: property.main_neighborhood,
                            city: property.main_city_name ? {
                                id: property.main_city_id,
                                name: property.main_city_name,
                                province: property.main_province_name ? {
                                    name: property.main_province_name
                                } : null
                            } : null
                        } : null,
                        // Imagen principal
                        primary_image: property.primary_image_path ? {
                            id: property.primary_image_id,
                            file_path: property.primary_image_path,
                            is_primary: true
                        } : null,
                        images_count: property.images_count || 0,
                        updated_at: property.updated_at
                    };
                })
            );
            
            return { properties: enrichedProperties, count: enrichedProperties.length };
        }

        /**
         * Actualiza una propiedad
         * Solo actualiza los campos proporcionados
         */
        async updateProperty(
            id: number,
            updateData: {
                title?: string;
                description?: string;
                property_type_id?: number;
                property_status_id?: number;
                visibility_status_id?: number;
                bedrooms_count?: number;
                bathrooms_count?: number;
                rooms_count?: number;
                parking_spaces_count?: number;
                land_area?: number;
                covered_area?: number;
                total_area?: number;
                situation_id?: number;
                age_id?: number;
                orientation_id?: number;
                disposition_id?: number;
                branch_name?: string;
                appraiser?: string;
                producer?: string;
                internal_comments?: string;
                operation_commission_percentage?: number;
                producer_commission_percentage?: number;
            }
        ) {
                // Verificar que la propiedad existe
                const existingProperty = await PropertyModel.findById(id);
                if (!existingProperty) {
                throw CustomError.notFound(`Property with ID ${id} not found`);
            }

            // Actualizar propiedad
            const updatedProperty = await PropertyModel.update(id, updateData);
            if (!updatedProperty) {
                throw CustomError.internalServerError('Failed to update property');
            }

            return { property: updatedProperty };
        }

        /**
         * Archiva una propiedad (soft delete usando visibility_status)
         */
        async archiveProperty(id: number) {
                // Verificar que la propiedad existe
            const property = await PropertyModel.findById(id);
                if (!property) {
                throw CustomError.notFound(`Property with ID ${id} not found`);
            }

            // Archivar
            const archived = await PropertyModel.archive(id);
            if (!archived) {
                throw CustomError.internalServerError('Failed to archive property');
            }

            return { message: 'Property archived successfully' };
        }

        /**
         * Restores an archived property
         */
        async unarchiveProperty(id: number, newVisibilityStatusId?: number) {
            // Verificar que la propiedad existe (incluyendo archivadas)
            const property = await PropertyModel.findById(id, true);
                if (!property) {
                throw CustomError.notFound(`Property with ID ${id} not found`);
            }

            // Restaurar
            const restored = await PropertyModel.unarchive(id, newVisibilityStatusId);
            if (!restored) {
                throw CustomError.internalServerError('Failed to unarchive property');
            }

            return { message: 'Property unarchived successfully' };
        }

        /**
         * Physically deletes a property (hard delete)
         * ⚠️ Only if it has no active rentals/sales
         */
        async deleteProperty(id: number) {
            // Verify that the property exists
            const property = await PropertyModel.findById(id, true);
            if (!property) {
                throw CustomError.notFound(`Property with ID ${id} not found`);
            }

            // Try to delete (may fail if there are RESTRICT constraints)
            try {
                const deleted = await PropertyModel.delete(id);
                if (!deleted) {
                    throw CustomError.internalServerError('Failed to delete property');
                }
                return { message: 'Property deleted successfully' };
            } catch (error: any) {
                // If there's a foreign key constraint error, it means it has RESTRICT relationships
                if (error.code === '23503') {
                    throw CustomError.badRequest(
                        'Cannot delete property: it has active rentals or sales. Archive it instead.'
                    );
                }
                    throw error;
                }
        }

        /**
         * Creates a property using the grouped structure
         * ALL IN A TRANSACTION: If any step fails, everything is reverted
         * 
         * Steps:
         * 1. Validate/get geography
         * 2. Create address
         * 3. Resolve services (create if they don't exist)
         * 4. Create property with all grouped data
         * 5. Link address
         * 6. Create prices and expenses
         * 7. Link services
         * 8. Upload images and PDF documents
         * 9. Create multimedia and document records
         */
        async createPropertyGrouped(
            createPropertyGroupedDto: CreatePropertyGroupedDto,
            capturedByUserId: number,
            images?: Express.Multer.File[],
            documents?: Express.Multer.File[],
            documentNames?: string[] // Array of names corresponding to each document
        ) {
            return await TransactionHelper.executeInTransaction(async () => {
                const { basic, geography: geoData, address: addrData, values, characteristics, surface, services: servicesData, internal } = createPropertyGroupedDto;
                
                if (basic.owner_id !== undefined && basic.owner_id !== null) {
                    // Validar que owner_id es un número válido positivo
                    if (isNaN(Number(basic.owner_id)) || Number(basic.owner_id) <= 0) {
                        throw CustomError.badRequest('owner_id must be a valid positive number');
                    }
                } 

                // 0. Validate owner (property owner client)
                //if (!basic.owner_id) {
                //    throw CustomError.badRequest('owner_id is required in Basic');
                //}
                
                const ownerClient = await ClientModel.findById(basic.owner_id);
                if (!ownerClient) {
                    throw CustomError.badRequest(`Client with ID ${basic.owner_id} not found`);
                }

                // 1. Resolve geography
                const geography = await this.resolveGeography(geoData);

                // 2. Create address
                const fullAddress = this.buildFullAddressFromGrouped(addrData);
                const address = await AddressModel.create({
                    full_address: fullAddress,
                    neighborhood: addrData.neighborhood,
                    postal_code: addrData.postal_code,
                    latitude: addrData.latitude,
                    longitude: addrData.longitude,
                    city_id: geography.cityId,
                });

                // 3. Resolve main catalog IDs
                // Try basic first, then characteristics as fallback
                const propertyTypeId = await this.resolveCatalogId(
                    basic.property_type_id || characteristics?.property_type_id,
                    basic.property_type || characteristics?.property_type,
                    PropertyTypeModel,
                    'Property type'
                );

                const propertyStatusId = await this.resolveCatalogId(
                    basic.property_status_id || characteristics?.property_status_id,
                    basic.property_status || characteristics?.property_status,
                    PropertyStatusModel,
                    'Property status'
                );

                const visibilityStatusId = await this.resolveCatalogId(
                    basic.visibility_status_id || characteristics?.visibility_status_id,
                    basic.visibility_status || characteristics?.visibility_status,
                    VisibilityStatusModel,
                    'Visibility status'
                );

                // 4. Resolve optional characteristic catalogs
                const situationId = characteristics?.situation_id
                    ? characteristics.situation_id
                    : characteristics?.situation
                        ? await this.resolveCatalogIdByName(characteristics.situation, PropertySituationModel, 'Situation')
                        : undefined;

                const ageId = characteristics?.age_id
                    ? characteristics.age_id
                    : characteristics?.age
                        ? await this.resolveCatalogIdByName(characteristics.age, PropertyAgeModel, 'Age')
                        : undefined;

                const orientationId = characteristics?.orientation_id
                    ? characteristics.orientation_id
                    : characteristics?.orientation
                        ? await this.resolveCatalogIdByName(characteristics.orientation, OrientationModel, 'Orientation')
                        : undefined;

                const dispositionId = characteristics?.disposition_id
                    ? characteristics.disposition_id
                    : characteristics?.disposition
                        ? await this.resolveCatalogIdByName(characteristics.disposition, DispositionModel, 'Disposition')
                        : undefined;

                // 5. Convert publication_date if it comes as string
                let publicationDate: Date | undefined = undefined;
                if (basic.publication_date) {
                    if (typeof basic.publication_date === 'string') {
                        publicationDate = new Date(basic.publication_date);
                    } else {
                        publicationDate = basic.publication_date;
                    }
                }

                // 6. Create property
                const property = await PropertyModel.create({
                    title: basic.title,
                    description: basic.description,
                    publication_date: publicationDate,
                    featured_web: basic.featured_web,
                    property_type_id: propertyTypeId,
                    property_status_id: propertyStatusId,
                    visibility_status_id: visibilityStatusId,
                    owner_id: basic.owner_id,
                    captured_by_user_id: capturedByUserId,
                    // Characteristics
                    bedrooms_count: characteristics?.bedrooms_count,
                    bathrooms_count: characteristics?.bathrooms_count,
                    rooms_count: characteristics?.rooms_count,
                    toilets_count: characteristics?.toilets_count,
                    parking_spaces_count: characteristics?.parking_spaces_count,
                    floors_count: characteristics?.floors_count,
                    situation_id: situationId,
                    age_id: ageId,
                    orientation_id: orientationId,
                    disposition_id: dispositionId,
                    // Surface
                    land_area: surface?.land_area,
                    semi_covered_area: surface?.semi_covered_area,
                    covered_area: surface?.covered_area,
                    total_built_area: surface?.total_built_area,
                    uncovered_area: surface?.uncovered_area,
                    total_area: surface?.total_area,
                    zoning: surface?.zoning,
                    // Internal information
                    branch_name: internal?.branch_name,
                    appraiser: internal?.appraiser,
                    producer: internal?.producer,
                    maintenance_user: internal?.maintenance_user,
                    keys_location: internal?.keys_location,
                    internal_comments: internal?.internal_comments,
                    social_media_info: internal?.social_media_info,
                    operation_commission_percentage: internal?.operation_commission_percentage,
                    producer_commission_percentage: internal?.producer_commission_percentage,
                });

                if (!property.id) {
                    throw CustomError.internalServerError('Failed to create property');
                }

                // 7. Link address
                await PropertyAddressModel.create({
                    property_id: property.id,
                    address_id: address.id!,
                });

                // 8. Create prices
                const prices = [];
                for (const priceDto of values.prices) {
                    let currencyTypeId = priceDto.currency_type_id;
                    if (!currencyTypeId && priceDto.currency_symbol) {
                        const currencyType = await CurrencyTypeModel.findBySymbol(priceDto.currency_symbol);
                        if (!currencyType || !currencyType.id) {
                            throw CustomError.badRequest(`Currency symbol "${priceDto.currency_symbol}" not found`);
                        }
                        currencyTypeId = currencyType.id;
                    }

                    let operationTypeId = priceDto.operation_type_id;
                    if (!operationTypeId && priceDto.operation_type) {
                        const operationType = await PropertyOperationTypeModel.findByName(priceDto.operation_type);
                        if (!operationType || !operationType.id) {
                            throw CustomError.badRequest(`Operation type "${priceDto.operation_type}" not found`);
                        }
                        operationTypeId = operationType.id;
                    }

                    if (!currencyTypeId || !operationTypeId) {
                        throw CustomError.badRequest('Failed to resolve currency or operation type');
                    }

                    const price = await PropertyPriceModel.create({
                        property_id: property.id,
                        price: priceDto.price,
                        currency_type_id: currencyTypeId,
                        operation_type_id: operationTypeId,
                    });
                    prices.push(price);
                }

                // 9. Create expenses (optional)
                const expenses = [];
                if (values.expenses && values.expenses.length > 0) {
                    for (const expenseDto of values.expenses) {
                        let currencyTypeId = expenseDto.currency_type_id;
                        if (!currencyTypeId && expenseDto.currency_symbol) {
                            const currencyType = await CurrencyTypeModel.findBySymbol(expenseDto.currency_symbol);
                            if (!currencyType || !currencyType.id) {
                                throw CustomError.badRequest(`Currency symbol "${expenseDto.currency_symbol}" not found for expense`);
                            }
                            currencyTypeId = currencyType.id;
                        }

                        if (!currencyTypeId) {
                            throw CustomError.badRequest('Currency is required for expense');
                        }

                        const expense = await ExpenseModel.create({
                            property_id: property.id,
                            amount: expenseDto.amount,
                            currency_type_id: currencyTypeId,
                            frequency: expenseDto.frequency,
                        });
                        expenses.push(expense);
                    }
                }

                // 10. Resolve and link services (create if they don't exist)
                if (servicesData && servicesData.services && servicesData.services.length > 0) {
                    for (const serviceName of servicesData.services) {
                        if (!serviceName || !serviceName.trim()) continue;

                        // Find or create service
                        let service = await CatalogServiceModel.findByName(serviceName.trim());
                        if (!service) {
                            service = await CatalogServiceModel.create({ name: serviceName.trim() });
                        }

                        if (!service || !service.id) {
                            throw CustomError.internalServerError(`Failed to resolve service "${serviceName}"`);
                        }

                        // Link service to property
                        await PropertyServiceModel.create({
                            property_id: property.id,
                            service_id: service.id,
                        });
                    }
                }

                // 11. Upload images and create multimedia records
                const uploadedImages: string[] = [];
                const multimediaRecords = [];

                console.log(`[PropertyServices] Processing images: ${images?.length || 0} images received`);

                if (images && images.length > 0) {
                    try {
                        for (let i = 0; i < images.length; i++) {
                            const image = images[i];
                            console.log(`[PropertyServices] Uploading image ${i + 1}/${images.length}: ${image.originalname}, size: ${image.size}, mimetype: ${image.mimetype}`);
                            
                            const imageUrl = await this.fileUploadAdapter.uploadFile(
                                image.buffer,
                                {
                                    folder: `properties/${property.id}`,
                                    resourceType: 'image',
                                }
                            );
                            console.log(`[PropertyServices] Image ${i + 1} uploaded successfully: ${imageUrl}`);
                            uploadedImages.push(imageUrl);

                            const multimedia = await PropertyMultimediaModel.create({
                                property_id: property.id,
                                file_path: imageUrl,
                                media_type: image.mimetype || 'image/jpeg',
                                is_primary: i === 0,
                            });
                            console.log(`[PropertyServices] Multimedia record created: ${JSON.stringify(multimedia)}`);
                            multimediaRecords.push(multimedia);
                        }
                        console.log(`[PropertyServices] Successfully processed ${multimediaRecords.length} images`);
                    } catch (error: any) {
                        console.error(`[PropertyServices] Error uploading images:`, error);
                        for (const url of uploadedImages) {
                            try {
                                await this.fileUploadAdapter.deleteFile(url);
                            } catch (deleteError) {
                                console.error('Error deleting uploaded image:', deleteError);
                            }
                        }
                        throw CustomError.internalServerError(`Error uploading images: ${error.message}`);
                    }
                } else {
                    console.log(`[PropertyServices] No images provided or images array is empty`);
                }

                // 12. Upload PDF documents and create records
                const uploadedDocuments: string[] = [];
                const documentRecords = [];

                if (documents && documents.length > 0) {
                    try {
                        for (let i = 0; i < documents.length; i++) {
                            const document = documents[i];
                            
                            // Validate that it's a PDF
                            if (document.mimetype !== 'application/pdf') {
                                throw CustomError.badRequest(`Document ${i + 1} must be a PDF file`);
                            }

                            // Get document name (from array or original filename)
                            const documentName = documentNames && documentNames[i]
                                ? documentNames[i].trim()
                                : document.originalname?.replace(/\.[^/.]+$/, '') || `Document ${i + 1}`;

                            // Upload PDF to Cloudinary
                            const documentUrl = await this.fileUploadAdapter.uploadFile(
                                document.buffer,
                                {
                                    folder: `properties/${property.id}/documents`,
                                    resourceType: 'raw', // PDFs are uploaded as raw
                                }
                            );
                            uploadedDocuments.push(documentUrl);

                            // Create document record
                            // Use property owner_id as client_id for the document
                            const docRecord = await PropertyDocumentModel.create({
                                property_id: property.id,
                                client_id: basic.owner_id, // Use property owner as the client
                                document_name: documentName,
                                file_path: documentUrl,
                            });
                            documentRecords.push(docRecord);
                        }
                    } catch (error: any) {
                        // Clean up uploaded documents
                        for (const url of uploadedDocuments) {
                            try {
                                await this.fileUploadAdapter.deleteFile(url);
                            } catch (deleteError) {
                                console.error('Error deleting uploaded document:', deleteError);
                            }
                        }
                        throw CustomError.internalServerError(`Error uploading documents: ${error.message}`);
                    }
                }

                // 13. Enrich response
                const [
                    propertyType,
                    propertyStatus,
                    visibilityStatus,
                    addressCity
                ] = await Promise.all([
                    PropertyTypeModel.findById(propertyTypeId),
                    PropertyStatusModel.findById(propertyStatusId),
                    VisibilityStatusModel.findById(visibilityStatusId),
                    CityModel.findById(geography.cityId)
                ]);

                const addressProvince = addressCity ? await ProvinceModel.findById(addressCity.province_id) : null;
                const addressCountry = addressProvince ? await CountryModel.findById(addressProvince.country_id) : null;

                // Enrich prices
                const enrichedPrices = await Promise.all(
                    prices.map(async (price: any) => {
                        const [currency, operationType] = await Promise.all([
                            CurrencyTypeModel.findById(price.currency_type_id),
                            PropertyOperationTypeModel.findById(price.operation_type_id)
                        ]);
                        
                        return {
                            id: price.id,
                            property_id: price.property_id,
                            price: price.price,
                            currency: currency ? {
                                id: currency.id,
                                name: currency.name,
                                symbol: currency.symbol
                            } : null,
                            operation_type: operationType ? {
                                id: operationType.id,
                                name: operationType.name
                            } : null,
                            updated_at: price.updated_at
                        };
                    })
                );

                // Enrich expenses
                const enrichedExpenses = expenses.length > 0 ? await Promise.all(
                    expenses.map(async (expense: any) => {
                        const currency = await CurrencyTypeModel.findById(expense.currency_type_id);
                        
                        return {
                            id: expense.id,
                            property_id: expense.property_id,
                            amount: expense.amount,
                            currency: currency ? {
                                id: currency.id,
                                name: currency.name,
                                symbol: currency.symbol
                            } : null,
                            frequency: expense.frequency || null,
                            registered_date: expense.registered_date
                        };
                    })
                ) : [];

                // Get linked services
                const propertyServices = await PropertyServiceModel.findByPropertyId(property.id);
                const enrichedServices = await Promise.all(
                    propertyServices.map(async (ps: any) => {
                        const service = await CatalogServiceModel.findById(ps.service_id);
                        return service ? {
                            id: service.id,
                            name: service.name
                        } : null;
                    })
                );

                // Return complete response with ALL fields (including nulls)
                return {
                    property: {
                        ...property,
                        // Main catalogs
                        property_type: propertyType ? {
                            id: propertyType.id,
                            name: propertyType.name
                        } : null,
                        property_status: propertyStatus ? {
                            id: propertyStatus.id,
                            name: propertyStatus.name
                        } : null,
                        visibility_status: visibilityStatus ? {
                            id: visibilityStatus.id,
                            name: visibilityStatus.name
                        } : null,
                        // Owner
                        owner: ownerClient ? {
                            id: ownerClient.id,
                            first_name: ownerClient.first_name,
                            last_name: ownerClient.last_name,
                            name: `${ownerClient.first_name} ${ownerClient.last_name}`,
                            email: ownerClient.email || null,
                            phone: ownerClient.phone || null,
                            dni: ownerClient.dni || null
                        } : null,
                        // Optional catalogs
                        age: ageId ? {
                            id: ageId,
                            name: (await PropertyAgeModel.findById(ageId))?.name || null
                        } : null,
                        orientation: orientationId ? {
                            id: orientationId,
                            name: (await OrientationModel.findById(orientationId))?.name || null
                        } : null,
                        disposition: dispositionId ? {
                            id: dispositionId,
                            name: (await DispositionModel.findById(dispositionId))?.name || null
                        } : null,
                        situation: situationId ? {
                            id: situationId,
                            name: (await PropertySituationModel.findById(situationId))?.name || null
                        } : null,
                        // Address
                        address: {
                            id: address.id,
                            full_address: address.full_address,
                            neighborhood: address.neighborhood || null,
                            postal_code: address.postal_code || null,
                            latitude: address.latitude || null,
                            longitude: address.longitude || null,
                            city: addressCity ? {
                                id: addressCity.id,
                                name: addressCity.name,
                                province: addressProvince ? {
                                    id: addressProvince.id,
                                    name: addressProvince.name,
                                    country: addressCountry ? {
                                        id: addressCountry.id,
                                        name: addressCountry.name
                                    } : null
                                } : null
                            } : null
                        },
                        // Prices
                        prices: enrichedPrices,
                        // Expenses
                        expenses: enrichedExpenses,
                        // Services
                        services: enrichedServices.filter(s => s !== null),
                        // Images
                        images: multimediaRecords,
                        // Documents
                        documents: documentRecords
                    }
                };
            });
        }

        /**
         * Builds the full address from the grouped DTO
         */
        private buildFullAddressFromGrouped(address: CreatePropertyGroupedDto['address']): string {
            const parts: string[] = [];
            
            if (address.street) {
                parts.push(address.street);
            }
            if (address.number) {
                parts.push(address.number);
            }
            if (address.neighborhood) {
                parts.push(address.neighborhood);
            }

            return parts.join(' ').trim() || address.street;
        }

        /**
         * Resolves a catalog ID: uses ID if provided, searches by name if provided
         */
        private async resolveCatalogId<T extends { id?: number }>(
            id: number | undefined,
            name: string | undefined,
            model: { findById(id: number): Promise<T | null>; findByName(name: string): Promise<T | null> },
            catalogName: string
        ): Promise<number> {
            if (id) {
                // Verify that the ID exists
                const catalog = await model.findById(id);
                if (!catalog || !catalog.id) {
                    throw CustomError.badRequest(`${catalogName} with ID ${id} not found`);
                }
                return catalog.id;
            }

            if (name) {
                const catalog = await model.findByName(name.trim());
                if (!catalog || !catalog.id) {
                    throw CustomError.badRequest(
                        `${catalogName} "${name}" not found. Please check the name or use the ID instead.`
                    );
                }
                return catalog.id;
            }

            throw CustomError.badRequest(`${catalogName} ID or name is required`);
        }

        /**
         * Resolves an optional catalog ID by name
         * Creates the catalog automatically if it doesn't exist (like services)
         */
        private async resolveCatalogIdByName<T extends { id?: number }, CreateDto = { name: string }>(
            name: string,
            model: { 
                findByName(name: string): Promise<T | null>;
                create(data: CreateDto): Promise<T>;
            },
            catalogName: string
        ): Promise<number | undefined> {
            if (!name) return undefined;
            
            // Try to find existing catalog
            let catalog = await model.findByName(name.trim());
            
            // If not found, create it automatically
            if (!catalog || !catalog.id) {
                catalog = await model.create({ name: name.trim() } as CreateDto);
            }
            
            if (!catalog || !catalog.id) {
                throw CustomError.internalServerError(
                    `Failed to resolve or create ${catalogName} "${name}"`
                );
            }
            
            return catalog.id;
        }
    }

