import { CreatePropertyGeographyDto } from './create-property-geography.dto';
import { CreatePropertyAddressDto } from './create-property-address.dto';
import { CreatePropertyPriceDto } from './create-property-price.dto';

export class CreatePropertyDto {
    constructor(
        public readonly title: string,
        public readonly property_type_id: number | undefined,
        public readonly property_type: string | undefined,
        public readonly property_status_id: number | undefined,
        public readonly property_status: string | undefined,
        public readonly visibility_status_id: number | undefined,
        public readonly visibility_status: string | undefined,
        
        public readonly geography: CreatePropertyGeographyDto,
        public readonly address: CreatePropertyAddressDto,
        
        public readonly prices: CreatePropertyPriceDto[],
        public readonly owner_id?: number, 
        public readonly description?: string,
        public readonly publication_date?: Date | string,
        public readonly featured_web?: boolean,
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
        public readonly situation_id?: number,
        public readonly situation?: string,
        public readonly age_id?: number,
        public readonly age?: string,
        public readonly orientation_id?: number,
        public readonly orientation?: string,
        public readonly disposition_id?: number,
        public readonly disposition?: string,
        public readonly branch_name?: string,
        public readonly appraiser?: string,
        public readonly producer?: string,
        public readonly maintenance_user?: string,
        public readonly keys_location?: string,
        public readonly internal_comments?: string,
        public readonly social_media_info?: string,
        public readonly operation_commission_percentage?: number,
        public readonly producer_commission_percentage?: number,
    ) {}

    static create(object: Record<string, unknown>): [string?, CreatePropertyDto?] {
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
            pricesData = [object.prices];
        }

        const title = propertyDetails.title || object.title;
        if (!title || title.trim().length === 0) {
            return ['Title is required', undefined];
        }
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


        const [geoError, geography] = CreatePropertyGeographyDto.create(geographyData);
        if (geoError || !geography) {
            return [geoError || 'Invalid geography data', undefined];
        }
        const [addrError, address] = CreatePropertyAddressDto.create(addressData);
        if (addrError || !address) {
            return [addrError || 'Invalid address data', undefined];
        }
        if (!pricesData || pricesData.length === 0) {
            return ['At least one price is required', undefined];
        }
        const ownerId = propertyDetails.owner_id || object.owner_id;
        if (ownerId !== undefined && ownerId !== null && isNaN(Number(ownerId))) {
            return ['Owner ID must be a number if provided. This should be a client (propietario) ID.', undefined];
        }

        const prices: CreatePropertyPriceDto[] = [];
        for (let i = 0; i < pricesData.length; i++) {
            const [priceError, price] = CreatePropertyPriceDto.create(pricesData[i]);
            if (priceError || !price) {
                return [`Price ${i + 1}: ${priceError || 'Invalid price data'}`, undefined];
            }
            prices.push(price);
        }

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
                    geography,
                    address,
                    prices,
                    ownerId ? Number(ownerId) : undefined,
                    (propertyDetails.description as string | undefined)?.trim() || (object.description as string | undefined)?.trim(),
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
                    (propertyDetails.zoning as string | undefined)?.trim() || (object.zoning as string | undefined)?.trim(),
                    hasSituationId ? Number(situationId) : undefined,
                    hasSituationName ? situationName.trim() : undefined,
                    hasAgeId ? Number(ageId) : undefined,
                    hasAgeName ? ageName.trim() : undefined,
                    hasOrientationId ? Number(orientationId) : undefined,
                    hasOrientationName ? orientationName.trim() : undefined,
                    hasDispositionId ? Number(dispositionId) : undefined,
                    hasDispositionName ? dispositionName.trim() : undefined,
                    (propertyDetails.branch_name as string | undefined)?.trim() || (object.branch_name as string | undefined)?.trim(),
                    (propertyDetails.appraiser as string | undefined)?.trim() || (object.appraiser as string | undefined)?.trim(),
                    (propertyDetails.producer as string | undefined)?.trim() || (object.producer as string | undefined)?.trim(),
                    (propertyDetails.maintenance_user as string | undefined)?.trim() || (object.maintenance_user as string | undefined)?.trim(),
                    (propertyDetails.keys_location as string | undefined)?.trim() || (object.keys_location as string | undefined)?.trim(),
                    (propertyDetails.internal_comments as string | undefined)?.trim() || (object.internal_comments as string | undefined)?.trim(),
                    (propertyDetails.social_media_info as string | undefined)?.trim() || (object.social_media_info as string | undefined)?.trim(),
                    propertyDetails.operation_commission_percentage ? Number(propertyDetails.operation_commission_percentage) : undefined,
                    propertyDetails.producer_commission_percentage ? Number(propertyDetails.producer_commission_percentage) : undefined,
                )
            ];
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Invalid property data';
            return [message, undefined];
        }
    }
}

