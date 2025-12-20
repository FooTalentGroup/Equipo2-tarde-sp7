import { CreatePropertyBasicDto } from './create-property-basic.dto';
import { CreatePropertyGeographyDto } from './create-property-geography.dto';
import { CreatePropertyAddressDto } from './create-property-address.dto';
import { CreatePropertyCharacteristicsDto } from './create-property-characteristics.dto';
import { CreatePropertySurfaceDto } from './create-property-surface.dto';
import { CreatePropertyServicesDto } from './create-property-services.dto';
import { CreatePropertyValuesDto } from './create-property-values.dto';
import { CreatePropertyInternalDto } from './create-property-internal.dto';

/**
 * Interface for image reordering
 */
export interface ImageOrderItem {
    id: number;
    is_primary?: boolean;
}

/**
 * Grouped DTO for updating properties
 * 
 * All fields are optional - only provided fields will be updated
 * 
 * Expected form-data structure (use camelCase - recommended):
 * - basic: JSON string with basic information (optional)
 * - address: JSON string with address data (optional)
 * - geography: JSON string with country, province, city (optional)
 * - characteristics: JSON string with physical characteristics (optional)
 * - surface: JSON string with surface data (optional)
 * - services: JSON string with array of service names (optional)
 * - values: JSON string with prices and expenses (optional)
 * - internal: JSON string with internal information (optional)
 * - images: Array of files (optional - will be added, not replaced)
 * - documents: Array of PDF files (optional - will be added, not replaced)
 * - imageOrder: JSON string with array of {id, is_primary} to reorder images (optional)
 * 
 * Note: PascalCase (Basic, Geography, etc.) is also accepted for backward compatibility,
 * but camelCase is the recommended convention.
 */
export class UpdatePropertyGroupedDto {
    constructor(
        // 1. Basic Information (optional)
        public readonly basic?: Partial<CreatePropertyBasicDto>,
        
        // 2. Geography (optional)
        public readonly geography?: CreatePropertyGeographyDto,
        
        // 3. Address (optional)
        public readonly address?: CreatePropertyAddressDto,
        
        // 4. Values (optional)
        public readonly values?: CreatePropertyValuesDto,
        
        // 5. Characteristics (optional)
        public readonly characteristics?: CreatePropertyCharacteristicsDto,
        
        // 6. Surface (optional)
        public readonly surface?: CreatePropertySurfaceDto,
        
        // 7. Services (optional)
        public readonly services?: CreatePropertyServicesDto,
        
        // 8. Internal Information (optional)
        public readonly internal?: CreatePropertyInternalDto,
        
        // 9. Image order (optional) - array of {id, is_primary} to reorder existing images
        public readonly imageOrder?: ImageOrderItem[],
    ) {}

    static create(object: Record<string, unknown>): [string?, UpdatePropertyGroupedDto?] {
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
                    } catch (error) {
                        // If it fails, try to fix common issues
                        try {
                            // Replace single quotes with double quotes (common mistake)
                            const fixed = field.replace(/'/g, '"');
                            return [undefined, JSON.parse(fixed)];
                        } catch (e) {
                            const errorMessage = error instanceof Error ? error.message : 'Invalid JSON format';
                            return [`Invalid JSON format in ${fieldName}: ${errorMessage}`, undefined];
                        }
                    }
                }
                
                // If it's already an object, return it
                return [undefined, field];
            };

            // Parse each group from form-data (all optional for update)
            let basic: any = undefined;
            let geography: any = undefined;
            let address: any = undefined;
            let characteristics: CreatePropertyCharacteristicsDto | undefined = undefined;
            let surface: CreatePropertySurfaceDto | undefined = undefined;
            let services: CreatePropertyServicesDto | undefined = undefined;
            let values: CreatePropertyValuesDto | undefined = undefined;
            let internal: CreatePropertyInternalDto | undefined = undefined;

            // 1. Parse Basic (optional)
            const basicField = object.basic || object.Basic;
            if (basicField) {
                const [basicError, basicParsed] = parseJsonField(basicField, 'basic');
                if (basicError) {
                    return [basicError, undefined];
                }
                basic = basicParsed;
            }

            // 2. Parse Geography (optional)
            const geographyField = object.geography || object.Geography;
            if (geographyField) {
                const [geographyError, geographyParsed] = parseJsonField(geographyField, 'geography');
                if (geographyError) {
                    return [geographyError, undefined];
                }
                geography = geographyParsed;
            }

            // 3. Parse Address (optional)
            const addressField = object.address || object.Address;
            if (addressField) {
                const [addressError, addressParsed] = parseJsonField(addressField, 'address');
                if (addressError) {
                    return [addressError, undefined];
                }
                address = addressParsed;
            }

            // 4. Parse Values (optional)
            const valuesField = object.values || object.Values;
            if (valuesField) {
                const [valuesError, valuesParsed] = parseJsonField(valuesField, 'values');
                if (valuesError) {
                    return [valuesError, undefined];
                }
                values = valuesParsed;
            }

            // 5. Parse Characteristics (optional)
            const characteristicsField = object.characteristics || object.Characteristics;
            if (characteristicsField) {
                const [charError, charParsed] = parseJsonField(characteristicsField, 'characteristics');
                if (charError) {
                    return [charError, undefined];
                }
                characteristics = charParsed;
            }

            // 6. Parse Surface (optional)
            const surfaceField = object.surface || object.Surface;
            if (surfaceField) {
                const [surfaceError, surfaceParsed] = parseJsonField(surfaceField, 'surface');
                if (surfaceError) {
                    return [surfaceError, undefined];
                }
                surface = surfaceParsed;
            }

            // 7. Parse Services (optional)
            const servicesField = object.services || object.Services;
            if (servicesField) {
                const [servicesError, servicesParsed] = parseJsonField(servicesField, 'services');
                if (servicesError) {
                    return [servicesError, undefined];
                }
                services = servicesParsed;
            }

            // 8. Parse Internal Information (optional)
            const internalField = object.internal || object.Internal;
            if (internalField) {
                const [internalError, internalParsed] = parseJsonField(internalField, 'internal');
                if (internalError) {
                    return [internalError, undefined];
                }
                internal = internalParsed;
            }

            // 9. Parse Image Order (optional) - for reordering existing images
            let imageOrder: ImageOrderItem[] | undefined = undefined;
            const imageOrderField = object.imageOrder || object.image_order || object.ImageOrder;
            if (imageOrderField) {
                const [imageOrderError, imageOrderParsed] = parseJsonField(imageOrderField, 'imageOrder');
                if (imageOrderError) {
                    return [imageOrderError, undefined];
                }
                
                if (imageOrderParsed) {
                    if (!Array.isArray(imageOrderParsed)) {
                        return ['imageOrder must be an array', undefined];
                    }
                    
                    // Validate that each item has an id
                    for (const item of imageOrderParsed) {
                        if (!item || typeof item.id !== 'number') {
                            return ['Each item in imageOrder must have a numeric id', undefined];
                        }
                    }
                    
                    imageOrder = imageOrderParsed;
                }
            }

            // At least one field must be provided
            if (!basic && !geography && !address && !values && !characteristics && !surface && !services && !internal && !imageOrder) {
                return ['At least one field must be provided for update', undefined];
            }

            return [
                undefined,
                new UpdatePropertyGroupedDto(
                    basic,
                    geography,
                    address,
                    values,
                    characteristics,
                    surface,
                    services,
                    internal,
                    imageOrder
                )
            ];
        } catch (error) {
            // Log the error for debugging
            console.error('Error parsing UpdatePropertyGroupedDto:', error);
            console.error('Request body keys:', Object.keys(object));
            console.error('Request body sample:', JSON.stringify(object).substring(0, 500));
            
            const message = error instanceof Error ? error.message : 'Error parsing property update data. Please check that all JSON fields are properly formatted.';
            return [
                message,
                undefined
            ];
        }
    }
}

