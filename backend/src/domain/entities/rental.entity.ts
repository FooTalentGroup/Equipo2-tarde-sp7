import { CustomError } from "../errors/custom.error";

export class RentalEntity {
    constructor(
        public id: string,
        public property_id: string,
        public client_id: string,
        public start_date: Date,
        public end_date: Date,
        public created_at?: Date,
    ) {}

    static fromObject(object: { [key: string]: any }): RentalEntity {
        const { 
            id, 
            property_id,
            client_id,
            start_date,
            end_date,
            created_at
        } = object;
        
        if (!id) throw CustomError.badRequest('Id is required');
        if (!property_id) {
            throw CustomError.badRequest('Property id is required');
        }
        if (!client_id) {
            throw CustomError.badRequest('Client id is required');
        }
        if (!start_date) {
            throw CustomError.badRequest('Start date is required');
        }
        if (!end_date) {
            throw CustomError.badRequest('End date is required');
        }
        
        // Parse dates
        const startDate = start_date instanceof Date ? start_date : new Date(start_date);
        const endDate = end_date instanceof Date ? end_date : new Date(end_date);
        
        if (isNaN(startDate.getTime())) {
            throw CustomError.badRequest('Invalid start date');
        }
        if (isNaN(endDate.getTime())) {
            throw CustomError.badRequest('Invalid end date');
        }
        
        // Validate that end date is after start date
        if (endDate <= startDate) {
            throw CustomError.badRequest('End date must be after start date');
        }
        
        // Validate date if it exists
        let createdAt: Date | undefined;
        
        if (created_at) {
            createdAt = created_at instanceof Date ? created_at : new Date(created_at);
            if (isNaN(createdAt.getTime())) {
                throw CustomError.badRequest('Invalid created_at date');
            }
        }

        return new RentalEntity(
            id,
            property_id,
            client_id,
            startDate,
            endDate,
            createdAt
        );
    }

    get durationInDays(): number {
        const diffTime = Math.abs(this.end_date.getTime() - this.start_date.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    isActive(date: Date = new Date()): boolean {
        return date >= this.start_date && date <= this.end_date;
    }
}

