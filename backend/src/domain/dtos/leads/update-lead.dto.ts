import { regularExps } from "../../../config";

export class UpdateLeadDto {
    constructor(
        public readonly status_id?: string,
        public readonly property_id?: string,
        public readonly profile_id?: string,
        public readonly origin?: string,
        public readonly visitor_name?: string,
        public readonly visitor_phone?: string,
        public readonly visitor_email?: string,
        public readonly message?: string,
    ){}

    static create( object: { [key: string]: any }): [string?, UpdateLeadDto?] {
        const { 
            property_id,
            profile_id,
            origin,
            status_id,
            visitor_name,
            visitor_phone,
            visitor_email,
            message
        } = object;
        
        // Si no hay ningún campo, retornar error
        if (!status_id && !property_id && !profile_id && !origin && 
            !visitor_name && !visitor_phone && !visitor_email && !message) {
            return ['At least one field must be provided', undefined];
        }
        
        // Validar formato de email si se proporciona
        if (visitor_email !== undefined && visitor_email !== null) {
            if (visitor_email.trim().length > 0) {
                if (!regularExps.email.test(visitor_email.trim())) {
                    return ['Visitor email format is invalid', undefined];
                }
            }
        }
        
        // Validar formato de phone si se proporciona
        if (visitor_phone !== undefined && visitor_phone !== null) {
            if (visitor_phone.trim().length > 0 && !regularExps.phone.test(visitor_phone.trim())) {
                return ['Visitor phone format is invalid', undefined];
            }
        }

        return [
            undefined, 
            new UpdateLeadDto(
                status_id?.trim() || undefined,
                property_id?.trim() || undefined,
                profile_id?.trim() || undefined,
                origin?.trim() || undefined,
                visitor_name?.trim() || undefined,
                visitor_phone?.trim() || undefined,
                visitor_email?.trim().toLowerCase() || undefined,
                message?.trim() || undefined
            )
        ];
    }
}

