import { PostgresDatabase } from '../../database';
import { SqlParams } from '../../../types/sql.types';

export interface Payment {
    id?: number;
    rental_id: number;
    payment_date: Date;
    amount: number;
    reference?: string;
    payment_method_id: number;
    payment_status_id: number;
}

export interface CreatePaymentDto {
    rental_id: number;
    payment_date: Date;
    amount: number;
    reference?: string;
    payment_method_id: number;
    payment_status_id: number;
}

export interface PaymentFilters {
    rental_id?: number;
    payment_status_id?: number;
    start_date?: Date;
    end_date?: Date;
    limit?: number;
    offset?: number;
}

export class PaymentModel {
    private static readonly TABLE_NAME = 'payments';

    static async create(paymentData: CreatePaymentDto): Promise<Payment> {
        const client = PostgresDatabase.getClient();
        
        const query = `
            INSERT INTO ${this.TABLE_NAME} (
                rental_id, payment_date, amount, reference, payment_method_id, payment_status_id
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        
        const result = await client.query(query, [
            paymentData.rental_id,
            paymentData.payment_date,
            paymentData.amount,
            paymentData.reference || null,
            paymentData.payment_method_id,
            paymentData.payment_status_id,
        ]);

        return result.rows[0];
    }

    static async findById(id: number): Promise<Payment | null> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE id = $1`;
        const result = await client.query(query, [id]);
        return result.rows[0] || null;
    }

    static async findByRentalId(rentalId: number): Promise<Payment[]> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE rental_id = $1 ORDER BY payment_date DESC`;
        const result = await client.query(query, [rentalId]);
        return result.rows;
    }

    static async findAll(filters?: PaymentFilters): Promise<Payment[]> {
        const client = PostgresDatabase.getClient();
        let query = `SELECT * FROM ${this.TABLE_NAME}`;
        const conditions: string[] = [];
        const values: SqlParams = [];
        let paramIndex = 1;

        if (filters) {
            if (filters.rental_id !== undefined) {
                conditions.push(`rental_id = $${paramIndex++}`);
                values.push(filters.rental_id);
            }
            if (filters.payment_status_id !== undefined) {
                conditions.push(`payment_status_id = $${paramIndex++}`);
                values.push(filters.payment_status_id);
            }
            if (filters.start_date) {
                conditions.push(`payment_date >= $${paramIndex++}`);
                values.push(filters.start_date);
            }
            if (filters.end_date) {
                conditions.push(`payment_date <= $${paramIndex++}`);
                values.push(filters.end_date);
            }
        }

        if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(' AND ')}`;
        }

        query += ` ORDER BY payment_date DESC`;

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

    static async update(id: number, updateData: Partial<CreatePaymentDto>): Promise<Payment | null> {
        const client = PostgresDatabase.getClient();
        
        const fields: string[] = [];
        const values: SqlParams = [];
        let paramIndex = 1;

        if (updateData.payment_date) {
            fields.push(`payment_date = $${paramIndex++}`);
            values.push(updateData.payment_date);
        }
        if (updateData.amount !== undefined) {
            fields.push(`amount = $${paramIndex++}`);
            values.push(updateData.amount);
        }
        if (updateData.reference !== undefined) {
            fields.push(`reference = $${paramIndex++}`);
            values.push(updateData.reference || null);
        }
        if (updateData.payment_method_id !== undefined) {
            fields.push(`payment_method_id = $${paramIndex++}`);
            values.push(updateData.payment_method_id);
        }
        if (updateData.payment_status_id !== undefined) {
            fields.push(`payment_status_id = $${paramIndex++}`);
            values.push(updateData.payment_status_id);
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

