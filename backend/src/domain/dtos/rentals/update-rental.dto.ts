export class UpdateRentalDto {
    constructor(
        public readonly property_id?: string,
        public readonly client_id?: string,
        public readonly start_date?: Date,
        public readonly end_date?: Date,
    ){}

    static create( object: { [key: string]: any }): [string?, UpdateRentalDto?] {
        const { property_id, client_id, start_date, end_date } = object;
        
        // Si no hay ningún campo, retornar error
        if (!property_id && !client_id && !start_date && !end_date) {
            return ['At least one field must be provided', undefined];
        }
        
        // Parsear fechas si se proporcionan
        let startDate: Date | undefined;
        let endDate: Date | undefined;
        
        if (start_date !== undefined && start_date !== null) {
            startDate = start_date instanceof Date ? start_date : new Date(start_date);
            if (isNaN(startDate.getTime())) {
                return ['Invalid start date format', undefined];
            }
        }
        
        if (end_date !== undefined && end_date !== null) {
            endDate = end_date instanceof Date ? end_date : new Date(end_date);
            if (isNaN(endDate.getTime())) {
                return ['Invalid end date format', undefined];
            }
        }
        
        // Si ambas fechas están presentes, validar que end_date sea después de start_date
        if (startDate && endDate && endDate <= startDate) {
            return ['End date must be after start date', undefined];
        }

        return [
            undefined, 
            new UpdateRentalDto(
                property_id?.trim() || undefined,
                client_id?.trim() || undefined,
                startDate,
                endDate
            )
        ];
    }
}

