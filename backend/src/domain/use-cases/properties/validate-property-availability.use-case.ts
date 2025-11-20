/**
 * Use Case: Validar disponibilidad de propiedad
 * Regla de negocio pura, sin dependencias externas
 */
export interface RentalPeriod {
    start_date: Date;
    end_date: Date;
}

export class ValidatePropertyAvailabilityUseCase {
    static execute(
        requestedStart: Date,
        requestedEnd: Date,
        existingRentals: RentalPeriod[]
    ): { isAvailable: boolean; reason?: string } {
        // Validar que las fechas sean válidas
        if (isNaN(requestedStart.getTime()) || isNaN(requestedEnd.getTime())) {
            return {
                isAvailable: false,
                reason: 'Invalid dates'
            };
        }
        
        // Validar que end_date sea después de start_date
        if (requestedEnd <= requestedStart) {
            return {
                isAvailable: false,
                reason: 'End date must be after start date'
            };
        }
        
        // Validar que no haya solapamiento con alquileres existentes
        for (const rental of existingRentals) {
            const rentalStart = rental.start_date instanceof Date 
                ? rental.start_date 
                : new Date(rental.start_date);
            const rentalEnd = rental.end_date instanceof Date 
                ? rental.end_date 
                : new Date(rental.end_date);
            
            // Verificar solapamiento
            if (
                (requestedStart >= rentalStart && requestedStart < rentalEnd) ||
                (requestedEnd > rentalStart && requestedEnd <= rentalEnd) ||
                (requestedStart <= rentalStart && requestedEnd >= rentalEnd)
            ) {
                return {
                    isAvailable: false,
                    reason: `Property is already rented from ${rentalStart.toISOString()} to ${rentalEnd.toISOString()}`
                };
            }
        }
        
        return { isAvailable: true };
    }
}

