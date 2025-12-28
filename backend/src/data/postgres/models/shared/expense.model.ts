import { PostgresDatabase } from '../../database';
import { SqlParams } from '../../../types/sql.types';

export interface Expense {
    id?: number;
    property_id: number;
    amount: number;
    currency_type_id: number;
    registered_date?: Date;
    frequency?: string;
}

export interface CreateExpenseDto {
    property_id: number;
    amount: number;
    currency_type_id: number;
    registered_date?: Date;
    frequency?: string;
}

export interface ExpenseFilters {
    property_id?: number;
    currency_type_id?: number;
    start_date?: Date;
    end_date?: Date;
    limit?: number;
    offset?: number;
}

export class ExpenseModel {
    private static readonly TABLE_NAME = 'expenses';

    static async create(expenseData: CreateExpenseDto): Promise<Expense> {
        const client = PostgresDatabase.getClient();
        
        const query = `
            INSERT INTO ${this.TABLE_NAME} (property_id, amount, currency_type_id, registered_date, frequency)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        
        const result = await client.query(query, [
            expenseData.property_id,
            expenseData.amount,
            expenseData.currency_type_id,
            expenseData.registered_date || new Date(),
            expenseData.frequency || null,
        ]);

        return result.rows[0];
    }

    static async findById(id: number): Promise<Expense | null> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE id = $1`;
        const result = await client.query(query, [id]);
        return result.rows[0] || null;
    }

    static async findByPropertyId(propertyId: number): Promise<Expense[]> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE property_id = $1 ORDER BY registered_date DESC`;
        const result = await client.query(query, [propertyId]);
        return result.rows;
    }

    static async findAll(filters?: ExpenseFilters): Promise<Expense[]> {
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
            if (filters.currency_type_id !== undefined) {
                conditions.push(`currency_type_id = $${paramIndex++}`);
                values.push(filters.currency_type_id);
            }
            if (filters.start_date) {
                conditions.push(`registered_date >= $${paramIndex++}`);
                values.push(filters.start_date);
            }
            if (filters.end_date) {
                conditions.push(`registered_date <= $${paramIndex++}`);
                values.push(filters.end_date);
            }
        }

        if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(' AND ')}`;
        }

        query += ` ORDER BY registered_date DESC`;

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

    static async update(id: number, updateData: Partial<CreateExpenseDto>): Promise<Expense | null> {
        const client = PostgresDatabase.getClient();
        
        const fields: string[] = [];
        const values: SqlParams = [];
        let paramIndex = 1;

        if (updateData.amount !== undefined) {
            fields.push(`amount = $${paramIndex++}`);
            values.push(updateData.amount);
        }
        if (updateData.currency_type_id !== undefined) {
            fields.push(`currency_type_id = $${paramIndex++}`);
            values.push(updateData.currency_type_id);
        }
        if (updateData.registered_date) {
            fields.push(`registered_date = $${paramIndex++}`);
            values.push(updateData.registered_date);
        }
        if (updateData.frequency !== undefined) {
            fields.push(`frequency = $${paramIndex++}`);
            values.push(updateData.frequency || null);
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

