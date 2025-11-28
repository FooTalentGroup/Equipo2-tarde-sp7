import { CreatePropertyGeographyDto } from './create-property-geography.dto';
import { CreatePropertyAddressDto } from './create-property-address.dto';
import { CreatePropertyPriceDto } from './create-property-price.dto';

/**
 * DTO principal para crear una propiedad
 * 
 * Estructura esperada en form-data:
 * - propertyDetails: JSON string con los detalles de la propiedad
 * - geography: JSON string con country, province, city
 * - address: JSON string con street, number, neighborhood, etc.
 * - prices: JSON string con array de precios [{price, currency_type_id, operation_type_id}]
 * - images: Array de archivos (opcional)
 */
export class CreatePropertyDto {
    constructor(
        // Detalles básicos (requeridos primero)
        public readonly title: string,
        // Acepta ID o nombre para mayor flexibilidad (requeridos - uno u otro)
        public readonly property_type_id: number | undefined,
        public readonly property_type: string | undefined,
        public readonly property_status_id: number | undefined,
        public readonly property_status: string | undefined,
        public readonly visibility_status_id: number | undefined,
        public readonly visibility_status: string | undefined,
        public readonly owner_id: number, // Requerido: cliente propietario (tabla clients)
        
        // Geografía y dirección (requeridos)
        public readonly geography: CreatePropertyGeographyDto,
        public readonly address: CreatePropertyAddressDto,
        
        // Precios (array - puede tener venta y/o alquiler) (requerido)
        public readonly prices: CreatePropertyPriceDto[],
        
        // Opcionales (después de los requeridos)
        public readonly description?: string,
        public readonly publication_date?: Date | string,
        public readonly featured_web?: boolean,
        
        // Características físicas (opcionales)
        public readonly bedrooms_count?: number,
        public readonly bathrooms_count?: number,
        public readonly rooms_count?: number,
        public readonly toilets_count?: number,
        public readonly parking_spaces_count?: number,
        public readonly floors_count?: number,
        public readonly land_area?: number,
        public readonly semi_covered_area?: number,
        public readonly covered_area?: number,
        public readonly total_built_area?: number,
        public readonly uncovered_area?: number,
        public readonly total_area?: number,
        public readonly zoning?: string,
        
        // Catálogos opcionales (aceptan ID o nombre)
        public readonly situation_id?: number,
        public readonly situation?: string,
        public readonly age_id?: number,
        public readonly age?: string,
        public readonly orientation_id?: number,
        public readonly orientation?: string,
        public readonly disposition_id?: number,
        public readonly disposition?: string,
        
        // Información interna (opcionales)
        public readonly branch_name?: string,
        public readonly appraiser?: string,
        public readonly producer?: string,
        public readonly maintenance_user?: string,
        public readonly keys_location?: string,
        public readonly internal_comments?: string,
        public readonly social_media_info?: string,
        
        // Comisiones (opcionales)
        public readonly operation_commission_percentage?: number,
        public readonly producer_commission_percentage?: number,
    ) {}

    static create(object: { [key: string]: any }): [string?, CreatePropertyDto?] {
        // Parsear propertyDetails si viene como string JSON
        let propertyDetails: any = {};
        if (typeof object.propertyDetails === 'string') {
            try {
                propertyDetails = JSON.parse(object.propertyDetails);
            } catch (error) {
                return ['Invalid propertyDetails JSON format', undefined];
            }
        } else if (object.propertyDetails) {
            propertyDetails = object.propertyDetails;
        }

        // Parsear geography
        let geographyData: any = {};
        if (typeof object.geography === 'string') {
            try {
                geographyData = JSON.parse(object.geography);
            } catch (error) {
                return ['Invalid geography JSON format', undefined];
            }
        } else if (object.geography) {
            geographyData = object.geography;
        }

        // Parsear address
        let addressData: any = {};
        if (typeof object.address === 'string') {
            try {
                addressData = JSON.parse(object.address);
            } catch (error) {
                return ['Invalid address JSON format', undefined];
            }
        } else if (object.address) {
            addressData = object.address;
        }

        // Parsear prices (array)
        let pricesData: any[] = [];
        if (typeof object.prices === 'string') {
            try {
                pricesData = JSON.parse(object.prices);
            } catch (error) {
                return ['Invalid prices JSON format', undefined];
            }
        } else if (Array.isArray(object.prices)) {
            pricesData = object.prices;
        } else if (object.prices) {
            // Si viene un solo precio, convertirlo a array
            pricesData = [object.prices];
        }

        // Validar campos requeridos
        const title = propertyDetails.title || object.title;
        if (!title || title.trim().length === 0) {
            return ['Title is required', undefined];
        }

        // Validar property_type: debe tener ID o nombre
        const propertyTypeId = propertyDetails.property_type_id || object.property_type_id;
        const propertyTypeName = propertyDetails.property_type || object.property_type;
        const hasPropertyTypeId = propertyTypeId !== undefined && propertyTypeId !== null;
        const hasPropertyTypeName = propertyTypeName !== undefined && propertyTypeName !== null;
        
        if (!hasPropertyTypeId && !hasPropertyTypeName) {
            return ['Property type ID or property type name is required', undefined];
        }
        if (hasPropertyTypeId && hasPropertyTypeName) {
            return ['Provide either property_type_id OR property_type name, not both', undefined];
        }
        if (hasPropertyTypeId && isNaN(Number(propertyTypeId))) {
            return ['Property type ID must be a number', undefined];
        }

        // Validar property_status: debe tener ID o nombre
        const propertyStatusId = propertyDetails.property_status_id || object.property_status_id;
        const propertyStatusName = propertyDetails.property_status || object.property_status;
        const hasPropertyStatusId = propertyStatusId !== undefined && propertyStatusId !== null;
        const hasPropertyStatusName = propertyStatusName !== undefined && propertyStatusName !== null;
        
        if (!hasPropertyStatusId && !hasPropertyStatusName) {
            return ['Property status ID or property status name is required', undefined];
        }
        if (hasPropertyStatusId && hasPropertyStatusName) {
            return ['Provide either property_status_id OR property_status name, not both', undefined];
        }
        if (hasPropertyStatusId && isNaN(Number(propertyStatusId))) {
            return ['Property status ID must be a number', undefined];
        }

        // Validar visibility_status: debe tener ID o nombre
        const visibilityStatusId = propertyDetails.visibility_status_id || object.visibility_status_id;
        const visibilityStatusName = propertyDetails.visibility_status || object.visibility_status;
        const hasVisibilityStatusId = visibilityStatusId !== undefined && visibilityStatusId !== null;
        const hasVisibilityStatusName = visibilityStatusName !== undefined && visibilityStatusName !== null;
        
        if (!hasVisibilityStatusId && !hasVisibilityStatusName) {
            return ['Visibility status ID or visibility status name is required', undefined];
        }
        if (hasVisibilityStatusId && hasVisibilityStatusName) {
            return ['Provide either visibility_status_id OR visibility_status name, not both', undefined];
        }
        if (hasVisibilityStatusId && isNaN(Number(visibilityStatusId))) {
            return ['Visibility status ID must be a number', undefined];
        }

        // owner_id es puede ser null (cliente propietario)
        // Puede venir en propertyDetails (form-data) o directamente en object
        const ownerId = propertyDetails.owner_id || object.owner_id || null;
        if (ownerId && (isNaN(Number(ownerId)) || Number(ownerId) <= 0)) {
            return ['Owner ID must be a valid positive number if provided.', undefined];
        }
        //owner_id es obligatorio
        //const ownerId = propertyDetails.owner_id || object.owner_id 
        //if (!ownerId || isNaN(Number(ownerId))) {
        //    return ['Owner ID is required and must be a number. This should be a client (propietario) ID. Make sure to include "owner_id" in propertyDetails JSON string.', undefined];
        //}

        // Validar geography
        const [geoError, geography] = CreatePropertyGeographyDto.create(geographyData);
        if (geoError || !geography) {
            return [geoError || 'Invalid geography data', undefined];
        }

        // Validar address
        const [addrError, address] = CreatePropertyAddressDto.create(addressData);
        if (addrError || !address) {
            return [addrError || 'Invalid address data', undefined];
        }

        // Validar prices (debe tener al menos uno)
        if (!pricesData || pricesData.length === 0) {
            return ['At least one price is required', undefined];
        }

        const prices: CreatePropertyPriceDto[] = [];
        for (let i = 0; i < pricesData.length; i++) {
            const [priceError, price] = CreatePropertyPriceDto.create(pricesData[i]);
            if (priceError || !price) {
                return [`Price ${i + 1}: ${priceError || 'Invalid price data'}`, undefined];
            }
            prices.push(price);
        }

        // Validar números opcionales
        const validateOptionalNumber = (value: any, fieldName: string): number | undefined => {
            if (value === undefined || value === null || value === '') {
                return undefined;
            }
            const num = Number(value);
            if (isNaN(num) || num < 0) {
                throw new Error(`${fieldName} must be a positive number`);
            }
            return num;
        };

        try {
            // Validar opcionales (situation, age, orientation, disposition)
            const situationId = propertyDetails.situation_id || object.situation_id;
            const situationName = propertyDetails.situation || object.situation;
            const hasSituationId = situationId !== undefined && situationId !== null;
            const hasSituationName = situationName !== undefined && situationName !== null;
            if (hasSituationId && hasSituationName) {
                return ['Provide either situation_id OR situation name, not both', undefined];
            }

            const ageId = propertyDetails.age_id || object.age_id;
            const ageName = propertyDetails.age || object.age;
            const hasAgeId = ageId !== undefined && ageId !== null;
            const hasAgeName = ageName !== undefined && ageName !== null;
            if (hasAgeId && hasAgeName) {
                return ['Provide either age_id OR age name, not both', undefined];
            }

            const orientationId = propertyDetails.orientation_id || object.orientation_id;
            const orientationName = propertyDetails.orientation || object.orientation;
            const hasOrientationId = orientationId !== undefined && orientationId !== null;
            const hasOrientationName = orientationName !== undefined && orientationName !== null;
            if (hasOrientationId && hasOrientationName) {
                return ['Provide either orientation_id OR orientation name, not both', undefined];
            }

            const dispositionId = propertyDetails.disposition_id || object.disposition_id;
            const dispositionName = propertyDetails.disposition || object.disposition;
            const hasDispositionId = dispositionId !== undefined && dispositionId !== null;
            const hasDispositionName = dispositionName !== undefined && dispositionName !== null;
            if (hasDispositionId && hasDispositionName) {
                return ['Provide either disposition_id OR disposition name, not both', undefined];
            }

            // Validar y parsear publication_date si viene
            let publicationDate: Date | undefined = undefined;
            if (propertyDetails.publication_date || object.publication_date) {
                const dateValue = propertyDetails.publication_date || object.publication_date;
                if (typeof dateValue === 'string') {
                    publicationDate = new Date(dateValue);
                    if (isNaN(publicationDate.getTime())) {
                        return ['Invalid publication_date format. Use ISO date string (YYYY-MM-DD)', undefined];
                    }
                } else if (dateValue instanceof Date) {
                    publicationDate = dateValue;
                }
            }

            // Validar featured_web
            let featuredWeb: boolean | undefined = undefined;
            if (propertyDetails.featured_web !== undefined || object.featured_web !== undefined) {
                const value = propertyDetails.featured_web !== undefined ? propertyDetails.featured_web : object.featured_web;
                if (typeof value === 'boolean') {
                    featuredWeb = value;
                } else if (typeof value === 'string') {
                    featuredWeb = value.toLowerCase() === 'true';
                } else {
                    featuredWeb = Boolean(value);
                }
            }

            return [
                undefined,
                new CreatePropertyDto(
                    title.trim(),
                    hasPropertyTypeId ? Number(propertyTypeId) : undefined,
                    hasPropertyTypeName ? propertyTypeName.trim() : undefined,
                    hasPropertyStatusId ? Number(propertyStatusId) : undefined,
                    hasPropertyStatusName ? propertyStatusName.trim() : undefined,
                    hasVisibilityStatusId ? Number(visibilityStatusId) : undefined,
                    hasVisibilityStatusName ? visibilityStatusName.trim() : undefined,
                    Number(ownerId), // Cliente propietario (requerido)
                    geography,
                    address,
                    prices,
                    propertyDetails.description?.trim() || object.description?.trim(),
                    publicationDate,
                    featuredWeb,
                    validateOptionalNumber(propertyDetails.bedrooms_count || object.bedrooms_count, 'bedrooms_count'),
                    validateOptionalNumber(propertyDetails.bathrooms_count || object.bathrooms_count, 'bathrooms_count'),
                    validateOptionalNumber(propertyDetails.rooms_count || object.rooms_count, 'rooms_count'),
                    validateOptionalNumber(propertyDetails.toilets_count || object.toilets_count, 'toilets_count'),
                    validateOptionalNumber(propertyDetails.parking_spaces_count || object.parking_spaces_count, 'parking_spaces_count'),
                    validateOptionalNumber(propertyDetails.floors_count || object.floors_count, 'floors_count'),
                    validateOptionalNumber(propertyDetails.land_area || object.land_area, 'land_area'),
                    validateOptionalNumber(propertyDetails.semi_covered_area || object.semi_covered_area, 'semi_covered_area'),
                    validateOptionalNumber(propertyDetails.covered_area || object.covered_area, 'covered_area'),
                    validateOptionalNumber(propertyDetails.total_built_area || object.total_built_area, 'total_built_area'),
                    validateOptionalNumber(propertyDetails.uncovered_area || object.uncovered_area, 'uncovered_area'),
                    validateOptionalNumber(propertyDetails.total_area || object.total_area, 'total_area'),
                    propertyDetails.zoning?.trim() || object.zoning?.trim(),
                    hasSituationId ? Number(situationId) : undefined,
                    hasSituationName ? situationName.trim() : undefined,
                    hasAgeId ? Number(ageId) : undefined,
                    hasAgeName ? ageName.trim() : undefined,
                    hasOrientationId ? Number(orientationId) : undefined,
                    hasOrientationName ? orientationName.trim() : undefined,
                    hasDispositionId ? Number(dispositionId) : undefined,
                    hasDispositionName ? dispositionName.trim() : undefined,
                    propertyDetails.branch_name?.trim() || object.branch_name?.trim(),
                    propertyDetails.appraiser?.trim() || object.appraiser?.trim(),
                    propertyDetails.producer?.trim() || object.producer?.trim(),
                    propertyDetails.maintenance_user?.trim() || object.maintenance_user?.trim(),
                    propertyDetails.keys_location?.trim() || object.keys_location?.trim(),
                    propertyDetails.internal_comments?.trim() || object.internal_comments?.trim(),
                    propertyDetails.social_media_info?.trim() || object.social_media_info?.trim(),
                    propertyDetails.operation_commission_percentage ? Number(propertyDetails.operation_commission_percentage) : undefined,
                    propertyDetails.producer_commission_percentage ? Number(propertyDetails.producer_commission_percentage) : undefined,
                )
            ];
        } catch (error: any) {
            return [error.message || 'Invalid property data', undefined];
        }
    }
}

