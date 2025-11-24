export class CreateRentalDto {
    constructor(
        public readonly property_id: string,
        public readonly client_id: string,
        public readonly start_date: Date,
        public readonly end_date: Date,
    ){}

    static create( object: { [key: string]: any }): [string?, CreateRentalDto?] {
        const { property_id, client_id, start_date, end_date } = object;
        
        // Validar campos requeridos
        if (!property_id || property_id.trim().length === 0) {
            return ['Property id is required', undefined];
        }
        if (!client_id || client_id.trim().length === 0) {
            return ['Client id is required', undefined];
        }
        if (!start_date) {
            return ['Start date is required', undefined];
        }
        if (!end_date) {
            return ['End date is required', undefined];
        }
        
        // Parsear fechas
        const startDate = start_date instanceof Date ? start_date : new Date(start_date);
        const endDate = end_date instanceof Date ? end_date : new Date(end_date);
        
        if (isNaN(startDate.getTime())) {
            return ['Invalid start date format', undefined];
        }
        if (isNaN(endDate.getTime())) {
            return ['Invalid end date format', undefined];
        }
        
        // Validar que end_date sea después de start_date
        if (endDate <= startDate) {
            return ['End date must be after start date', undefined];
        }

        return [
            undefined, 
            new CreateRentalDto(
                property_id.trim(),
                client_id.trim(),
                startDate,
                endDate
            )
        ];
    }
}

