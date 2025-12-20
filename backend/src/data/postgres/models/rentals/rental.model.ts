import { PostgresDatabase } from '../../database';
import { SqlParams } from '../../../types/sql.types';

export interface Rental {
    id?: number;
    property_id: number;
    client_rental_id: number;
    start_date: Date;
    end_date?: Date;
    next_increase_date?: Date;
    monthly_amount: number;
    currency_type_id: number;
    created_by_user_id: number;
    remind_increase?: boolean;
    remind_contract_end?: boolean;
}

export interface CreateRentalDto {
    property_id: number;
    client_rental_id: number;
    start_date: Date;
    end_date?: Date;
    next_increase_date?: Date;
    monthly_amount: number;
    currency_type_id: number;
    created_by_user_id: number;
    remind_increase?: boolean;
    remind_contract_end?: boolean;
}

export interface RentalFilters {
    property_id?: number;
    client_rental_id?: number;
    active?: boolean; // end_date IS NULL OR end_date >= CURRENT_DATE
    created_by_user_id?: number;
    limit?: number;
    offset?: number;
}

export class RentalModel {
    private static readonly TABLE_NAME = 'rentals';

    static async create(rentalData: CreateRentalDto): Promise<Rental> {
        const client = PostgresDatabase.getClient();
        
        const query = `
            INSERT INTO ${this.TABLE_NAME} (
                property_id, client_rental_id, start_date, end_date,
                next_increase_date, monthly_amount, currency_type_id,
                created_by_user_id, remind_increase, remind_contract_end
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *
        `;
        
        const result = await client.query(query, [
            rentalData.property_id,
            rentalData.client_rental_id,
            rentalData.start_date,
            rentalData.end_date || null,
            rentalData.next_increase_date || null,
            rentalData.monthly_amount,
            rentalData.currency_type_id,
            rentalData.created_by_user_id,
            rentalData.remind_increase !== undefined ? rentalData.remind_increase : false,
            rentalData.remind_contract_end !== undefined ? rentalData.remind_contract_end : false,
        ]);

        return result.rows[0];
    }

    static async findById(id: number): Promise<Rental | null> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE id = $1`;
        const result = await client.query(query, [id]);
        return result.rows[0] || null;
    }

    static async findAll(filters?: RentalFilters): Promise<Rental[]> {
        const client = PostgresDatabase.getClient();
        let query = `SELECT * FROM ${this.TABLE_NAME}`;
        const conditions: string[] = [];
        const values: SqlParams = [];
        let paramIndex = 1;

        if (filters) {
            if (filters.property_id !== undefined) {
                conditions.push(`property_id = $${paramIndex++}`);
                values.push(filters.property_id);
            }
            if (filters.client_rental_id !== undefined) {
                conditions.push(`client_rental_id = $${paramIndex++}`);
                values.push(filters.client_rental_id);
            }
            if (filters.active !== undefined) {
                if (filters.active) {
                    conditions.push(`(end_date IS NULL OR end_date >= CURRENT_DATE)`);
                } else {
                    conditions.push(`end_date IS NOT NULL AND end_date < CURRENT_DATE`);
                }
            }
            if (filters.created_by_user_id !== undefined) {
                conditions.push(`created_by_user_id = $${paramIndex++}`);
                values.push(filters.created_by_user_id);
            }
        }

        if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(' AND ')}`;
        }

        query += ` ORDER BY start_date DESC`;

        if (filters?.limit) {
            query += ` LIMIT $${paramIndex++}`;
            values.push(filters.limit);
            if (filters.offset) {
                query += ` OFFSET $${paramIndex++}`;
                values.push(filters.offset);
            }
        }

        const result = await client.query(query, values);
        return result.rows;
    }

    static async findActiveByPropertyId(propertyId: number): Promise<Rental | null> {
        const client = PostgresDatabase.getClient();
        const query = `
            SELECT * FROM ${this.TABLE_NAME}
            WHERE property_id = $1 AND (end_date IS NULL OR end_date >= CURRENT_DATE)
            ORDER BY start_date DESC
            LIMIT 1
        `;
        const result = await client.query(query, [propertyId]);
        return result.rows[0] || null;
    }

    static async update(id: number, updateData: Partial<CreateRentalDto>): Promise<Rental | null> {
        const client = PostgresDatabase.getClient();
        
        const fields: string[] = [];
        const values: SqlParams = [];
        let paramIndex = 1;

        if (updateData.start_date) {
            fields.push(`start_date = $${paramIndex++}`);
            values.push(updateData.start_date);
        }
        if (updateData.end_date !== undefined) {
            fields.push(`end_date = $${paramIndex++}`);
            values.push(updateData.end_date || null);
        }
        if (updateData.next_increase_date !== undefined) {
            fields.push(`next_increase_date = $${paramIndex++}`);
            values.push(updateData.next_increase_date || null);
        }
        if (updateData.monthly_amount !== undefined) {
            fields.push(`monthly_amount = $${paramIndex++}`);
            values.push(updateData.monthly_amount);
        }
        if (updateData.currency_type_id !== undefined) {
            fields.push(`currency_type_id = $${paramIndex++}`);
            values.push(updateData.currency_type_id);
        }
        if (updateData.remind_increase !== undefined) {
            fields.push(`remind_increase = $${paramIndex++}`);
            values.push(updateData.remind_increase);
        }
        if (updateData.remind_contract_end !== undefined) {
            fields.push(`remind_contract_end = $${paramIndex++}`);
            values.push(updateData.remind_contract_end);
        }

        if (fields.length === 0) {
            return await this.findById(id);
        }

        values.push(id);

        const query = `
            UPDATE ${this.TABLE_NAME}
            SET ${fields.join(', ')}
            WHERE id = $${paramIndex}
            RETURNING *
        `;

        const result = await client.query(query, values);
        return result.rows[0] || null;
    }

    static async delete(id: number): Promise<boolean> {
        const client = PostgresDatabase.getClient();
        const query = `DELETE FROM ${this.TABLE_NAME} WHERE id = $1`;
        const result = await client.query(query, [id]);
        return (result.rowCount ?? 0) > 0;
    }
}

