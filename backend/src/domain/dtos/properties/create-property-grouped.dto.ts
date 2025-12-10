import { CreatePropertyBasicDto } from './create-property-basic.dto';
import { CreatePropertyGeographyDto } from './create-property-geography.dto';
import { CreatePropertyAddressDto } from './create-property-address.dto';
import { CreatePropertyCharacteristicsDto } from './create-property-characteristics.dto';
import { CreatePropertySurfaceDto } from './create-property-surface.dto';
import { CreatePropertyServicesDto } from './create-property-services.dto';
import { CreatePropertyValuesDto } from './create-property-values.dto';
import { CreatePropertyInternalDto } from './create-property-internal.dto';

/**
 * Grouped DTO for creating properties
 * 
 * Organized structure in logical groups for easier management and maintenance.
 * 
 * Expected form-data structure (use camelCase - recommended):
 * - basic: JSON string with basic information
 * - address: JSON string with address data
 * - geography: JSON string with country, province, city
 * - characteristics: JSON string with physical characteristics (optional)
 * - surface: JSON string with surface data (optional)
 * - services: JSON string with array of service names (optional)
 * - values: JSON string with prices and expenses
 * - internal: JSON string with internal information (optional)
 * - images: Array of files (optional)
 * - documents: Array of PDF files (optional)
 * 
 * Note: PascalCase (Basic, Geography, etc.) is also accepted for backward compatibility,
 * but camelCase is the recommended convention.
 */
export class CreatePropertyGroupedDto {
    constructor(
        // 1. Basic Information
        public readonly basic: CreatePropertyBasicDto,
        
        // 2. Geography (required)
        public readonly geography: CreatePropertyGeographyDto,
        
        // 3. Address (required)
        public readonly address: CreatePropertyAddressDto,
        
        // 4. Values (required - at least one price)
        public readonly values: CreatePropertyValuesDto,
        
        // 5. Characteristics (optional)
        public readonly characteristics?: CreatePropertyCharacteristicsDto,
        
        // 6. Surface (optional)
        public readonly surface?: CreatePropertySurfaceDto,
        
        // 7. Services (optional)
        public readonly services?: CreatePropertyServicesDto,
        
        // 8. Internal Information (optional)
        public readonly internal?: CreatePropertyInternalDto,
    ) {}

    static create(object: { [key: string]: any }): [string?, CreatePropertyGroupedDto?] {
        try {
            // Helper function to safely parse JSON strings
            const parseJsonField = (field: any, fieldName: string): [string?, any?] => {
                if (!field) {
                    return [undefined, undefined];
                }
                
                if (typeof field === 'string') {
                    try {
                        // Try to parse as JSON
                        return [undefined, JSON.parse(field)];
                    } catch (error: any) {
                        // If it fails, try to fix common issues
                        try {
                            // Replace single quotes with double quotes (common mistake)
                            const fixed = field.replace(/'/g, '"');
                            return [undefined, JSON.parse(fixed)];
                        } catch (e) {
                            return [`Invalid JSON format in ${fieldName}: ${error.message}`, undefined];
                        }
                    }
                }
                
                // If it's already an object, return it
                return [undefined, field];
            };

            // Parse each group from form-data
            let basic: any = {};
            let geography: any = {};
            let address: any = {};
            let characteristics: CreatePropertyCharacteristicsDto | undefined = undefined;
            let surface: CreatePropertySurfaceDto | undefined = undefined;
            let services: CreatePropertyServicesDto | undefined = undefined;
            let values: CreatePropertyValuesDto = { prices: [] };
            let internal: CreatePropertyInternalDto | undefined = undefined;

            // 1. Parse Basic (required) - prefer camelCase, but accept PascalCase for compatibility
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

            // Validate required fields in basic
            if (!basic.title || !basic.title.trim()) {
                return ['title is required in basic', undefined];
            }

            // 2. Parse Geography (required) - prefer camelCase, but accept PascalCase for compatibility
            const geographyField = object.geography || object.Geography;
            if (!geographyField) {
                return ['geography is required', undefined];
            }
            
            const [geographyError, geographyParsed] = parseJsonField(geographyField, 'geography');
            if (geographyError) {
                return [geographyError, undefined];
            }
            geography = geographyParsed || {};

            // Validate geography
            if (!geography.country || !geography.province || !geography.city) {
                return ['geography must include country, province and city', undefined];
            }

            // 3. Parse Address (required) - prefer camelCase, but accept PascalCase for compatibility
            const addressField = object.address || object.Address;
            if (!addressField) {
                return ['address is required', undefined];
            }
            
            const [addressError, addressParsed] = parseJsonField(addressField, 'address');
            if (addressError) {
                return [addressError, undefined];
            }
            address = addressParsed || {};

            // Validate address
            if (!address.street || !address.street.trim()) {
                return ['Address.street is required', undefined];
            }

            // 4. Parse Values (required - at least one price) - prefer camelCase, but accept PascalCase for compatibility
            const valuesField = object.values || object.Values;
            if (valuesField) {
                const [valuesError, valuesParsed] = parseJsonField(valuesField, 'values');
                if (valuesError) {
                    return [valuesError, undefined];
                }
                values = valuesParsed || { prices: [] };
            } else if (object.prices) {
                // Compatibility with previous format
                const [pricesError, pricesParsed] = parseJsonField(object.prices, 'prices');
                if (pricesError) {
                    return [pricesError, undefined];
                }
                values = { prices: Array.isArray(pricesParsed) ? pricesParsed : [pricesParsed] };
            }

            // Validate that there is at least one price
            if (!values.prices || !Array.isArray(values.prices) || values.prices.length === 0) {
                return ['values.prices is required and must contain at least one price', undefined];
            }

            // 5. Parse Characteristics (optional) - prefer camelCase, but accept PascalCase for compatibility
            const characteristicsField = object.characteristics || object.Characteristics;
            if (characteristicsField) {
                const [charError, charParsed] = parseJsonField(characteristicsField, 'characteristics');
                if (charError) {
                    return [charError, undefined];
                }
                characteristics = charParsed;
            }

            // 6. Parse Surface (optional) - prefer camelCase, but accept PascalCase for compatibility
            const surfaceField = object.surface || object.Surface;
            if (surfaceField) {
                const [surfaceError, surfaceParsed] = parseJsonField(surfaceField, 'surface');
                if (surfaceError) {
                    return [surfaceError, undefined];
                }
                surface = surfaceParsed;
            }

            // 7. Parse Services (optional) - prefer camelCase, but accept PascalCase for compatibility
            const servicesField = object.services || object.Services;
            if (servicesField) {
                const [servicesError, servicesParsed] = parseJsonField(servicesField, 'services');
                if (servicesError) {
                    return [servicesError, undefined];
                }
                services = servicesParsed;
            }

            // 8. Parse Internal Information (optional) - prefer camelCase, but accept PascalCase for compatibility
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
        } catch (error: any) {
            // Log the error for debugging
            console.error('Error parsing CreatePropertyGroupedDto:', error);
            console.error('Request body keys:', Object.keys(object));
            console.error('Request body sample:', JSON.stringify(object).substring(0, 500));
            
            return [
                error.message || 'Error parsing property data. Please check that all JSON fields are properly formatted.',
                undefined
            ];
        }
    }
}

