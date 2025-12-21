import { CreatePropertyBasicDto } from './create-property-basic.dto';
import { CreatePropertyGeographyDto } from './create-property-geography.dto';
import { CreatePropertyAddressDto } from './create-property-address.dto';
import { CreatePropertyCharacteristicsDto } from './create-property-characteristics.dto';
import { CreatePropertySurfaceDto } from './create-property-surface.dto';
import { CreatePropertyServicesDto } from './create-property-services.dto';
import { CreatePropertyValuesDto } from './create-property-values.dto';
import { CreatePropertyInternalDto } from './create-property-internal.dto';

export interface ImageOrderItem {
    id: number;
    is_primary?: boolean;
}


export class UpdatePropertyGroupedDto {
    constructor(
        public readonly basic?: Partial<CreatePropertyBasicDto>,
        public readonly geography?: CreatePropertyGeographyDto,
        public readonly address?: CreatePropertyAddressDto,
        public readonly values?: CreatePropertyValuesDto,
        public readonly characteristics?: CreatePropertyCharacteristicsDto,
        public readonly surface?: CreatePropertySurfaceDto,
        public readonly services?: CreatePropertyServicesDto,
        public readonly internal?: CreatePropertyInternalDto,
        public readonly imageOrder?: ImageOrderItem[],
    ) {}

    static create(object: Record<string, unknown>): [string?, UpdatePropertyGroupedDto?] {
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

            let basic: any = undefined;
            let geography: any = undefined;
            let address: any = undefined;
            let characteristics: CreatePropertyCharacteristicsDto | undefined = undefined;
            let surface: CreatePropertySurfaceDto | undefined = undefined;
            let services: CreatePropertyServicesDto | undefined = undefined;
            let values: CreatePropertyValuesDto | undefined = undefined;
            let internal: CreatePropertyInternalDto | undefined = undefined;

            const basicField = object.basic || object.Basic;
            if (basicField) {
                const [basicError, basicParsed] = parseJsonField(basicField, 'basic');
                if (basicError) {
                    return [basicError, undefined];
                }
                basic = basicParsed;
            }

            const geographyField = object.geography || object.Geography;
            if (geographyField) {
                const [geographyError, geographyParsed] = parseJsonField(geographyField, 'geography');
                if (geographyError) {
                    return [geographyError, undefined];
                }
                geography = geographyParsed;
            }

            const addressField = object.address || object.Address;
            if (addressField) {
                const [addressError, addressParsed] = parseJsonField(addressField, 'address');
                if (addressError) {
                    return [addressError, undefined];
                }
                address = addressParsed;
            }

            const valuesField = object.values || object.Values;
            if (valuesField) {
                const [valuesError, valuesParsed] = parseJsonField(valuesField, 'values');
                if (valuesError) {
                    return [valuesError, undefined];
                }
                values = valuesParsed;
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
                    
                    for (const item of imageOrderParsed) {
                        if (!item || typeof item.id !== 'number') {
                            return ['Each item in imageOrder must have a numeric id', undefined];
                        }
                    }
                    
                    imageOrder = imageOrderParsed;
                }
            }

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

