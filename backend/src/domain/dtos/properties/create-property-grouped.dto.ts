import { CreatePropertyBasicDto } from './create-property-basic.dto';
import { CreatePropertyGeographyDto } from './create-property-geography.dto';
import { CreatePropertyAddressDto } from './create-property-address.dto';
import { CreatePropertyCharacteristicsDto } from './create-property-characteristics.dto';
import { CreatePropertySurfaceDto } from './create-property-surface.dto';
import { CreatePropertyServicesDto } from './create-property-services.dto';
import { CreatePropertyValuesDto } from './create-property-values.dto';
import { CreatePropertyInternalDto } from './create-property-internal.dto';


export class CreatePropertyGroupedDto {
    constructor(
        public readonly basic: CreatePropertyBasicDto,
        public readonly geography: CreatePropertyGeographyDto,
        public readonly address: CreatePropertyAddressDto,
        public readonly values: CreatePropertyValuesDto,
        public readonly characteristics?: CreatePropertyCharacteristicsDto,
        public readonly surface?: CreatePropertySurfaceDto,
        public readonly services?: CreatePropertyServicesDto,
        public readonly internal?: CreatePropertyInternalDto,
    ) {}

    static create(object: Record<string, unknown>): [string?, CreatePropertyGroupedDto?] {
        try {
            const parseJsonField = (field: any, fieldName: string): [string?, any?] => {
                if (!field) {
                    return [undefined, undefined];
                }
                
                if (typeof field === 'string') {
                    try {
                        return [undefined, JSON.parse(field)];
                    } catch (error) {
                        try {
                            const fixed = field.replace(/'/g, '"');
                            return [undefined, JSON.parse(fixed)];
                        } catch (e) {
                            const errorMessage = error instanceof Error ? error.message : 'Invalid JSON format';
                            return [`Invalid JSON format in ${fieldName}: ${errorMessage}`, undefined];
                        }
                    }
                }
                
                return [undefined, field];
            };

            let basic: any = {};
            let geography: any = {};
            let address: any = {};
            let characteristics: CreatePropertyCharacteristicsDto | undefined = undefined;
            let surface: CreatePropertySurfaceDto | undefined = undefined;
            let services: CreatePropertyServicesDto | undefined = undefined;
            let values: CreatePropertyValuesDto = { prices: [] };
            let internal: CreatePropertyInternalDto | undefined = undefined;

            const basicField = object.basic || object.Basic;
            if (!basicField) {
                return ['basic is required', undefined];
            }
            
            const [basicError, basicParsed] = parseJsonField(basicField, 'basic');
            if (basicError) {
                return [basicError, undefined];
            }
            basic = basicParsed || {};
            console.log('[CreatePropertyGroupedDto] basic after parsing:', JSON.stringify(basic));
            console.log('[CreatePropertyGroupedDto] basic.owner_id:', basic.owner_id, 'type:', typeof basic.owner_id);

            if (!basic.title || !basic.title.trim()) {
                return ['title is required in basic', undefined];
            }

            const geographyField = object.geography || object.Geography;
            if (!geographyField) {
                return ['geography is required', undefined];
            }
            
            const [geographyError, geographyParsed] = parseJsonField(geographyField, 'geography');
            if (geographyError) {
                return [geographyError, undefined];
            }
            geography = geographyParsed || {};

            if (!geography.country || !geography.province || !geography.city) {
                return ['geography must include country, province and city', undefined];
            }
            const addressField = object.address || object.Address;
            if (!addressField) {
                return ['address is required', undefined];
            }
            
            const [addressError, addressParsed] = parseJsonField(addressField, 'address');
            if (addressError) {
                return [addressError, undefined];
            }
            address = addressParsed || {};

            if (!address.street || !address.street.trim()) {
                return ['Address.street is required', undefined];
            }
            const valuesField = object.values || object.Values;
            if (valuesField) {
                const [valuesError, valuesParsed] = parseJsonField(valuesField, 'values');
                if (valuesError) {
                    return [valuesError, undefined];
                }
                values = valuesParsed || { prices: [] };
            } else if (object.prices) {
                const [pricesError, pricesParsed] = parseJsonField(object.prices, 'prices');
                if (pricesError) {
                    return [pricesError, undefined];
                }
                values = { prices: Array.isArray(pricesParsed) ? pricesParsed : [pricesParsed] };
            }

            if (!values.prices || !Array.isArray(values.prices) || values.prices.length === 0) {
                return ['values.prices is required and must contain at least one price', undefined];
            }

            const characteristicsField = object.characteristics || object.Characteristics;
            if (characteristicsField) {
                const [charError, charParsed] = parseJsonField(characteristicsField, 'characteristics');
                if (charError) {
                    return [charError, undefined];
                }
                characteristics = charParsed;
            }

            const surfaceField = object.surface || object.Surface;
            if (surfaceField) {
                const [surfaceError, surfaceParsed] = parseJsonField(surfaceField, 'surface');
                if (surfaceError) {
                    return [surfaceError, undefined];
                }
                surface = surfaceParsed;
            }

            const servicesField = object.services || object.Services;
            if (servicesField) {
                const [servicesError, servicesParsed] = parseJsonField(servicesField, 'services');
                if (servicesError) {
                    return [servicesError, undefined];
                }
                services = servicesParsed;
            }

            const internalField = object.internal || object.Internal;
            if (internalField) {
                const [internalError, internalParsed] = parseJsonField(internalField, 'internal');
                if (internalError) {
                    return [internalError, undefined];
                }
                internal = internalParsed;
            }

            return [
                undefined,
                new CreatePropertyGroupedDto(
                    basic,
                    geography,
                    address,
                    values,
                    characteristics,
                    surface,
                    services,
                    internal
                )
            ];
        } catch (error) {
            console.error('Error parsing CreatePropertyGroupedDto:', error);
            console.error('Request body keys:', Object.keys(object));
            console.error('Request body sample:', JSON.stringify(object).substring(0, 500));
            
            const message = error instanceof Error ? error.message : 'Error parsing property data. Please check that all JSON fields are properly formatted.';
            return [
                message,
                undefined
            ];
        }
    }
}

