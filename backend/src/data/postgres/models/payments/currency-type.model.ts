import { PostgresDatabase } from '../../database';

export interface CurrencyType {
    id?: number;
    name: string;
    symbol: string;
}

export interface CreateCurrencyTypeDto {
    name: string;
    symbol: string;
}

export class CurrencyTypeModel {
    private static readonly TABLE_NAME = 'currency_types';

    static async create(data: CreateCurrencyTypeDto): Promise<CurrencyType> {
        const client = PostgresDatabase.getClient();
        const query = `INSERT INTO ${this.TABLE_NAME} (name, symbol) VALUES ($1, $2) RETURNING *`;
        const result = await client.query(query, [data.name, data.symbol]);
        return result.rows[0];
    }

    static async findAll(): Promise<CurrencyType[]> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} ORDER BY name`;
        const result = await client.query(query);
        return result.rows;
    }

    static async findById(id: number): Promise<CurrencyType | null> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE id = $1`;
        const result = await client.query(query, [id]);
        return result.rows[0] || null;
    }

    static async findByName(name: string): Promise<CurrencyType | null> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE name = $1`;
        const result = await client.query(query, [name]);
        return result.rows[0] || null;
    }

    static async findBySymbol(symbol: string): Promise<CurrencyType | null> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE UPPER(symbol) = UPPER($1)`;
        const result = await client.query(query, [symbol]);
        return result.rows[0] || null;
    }

    static async update(id: number, updateData: Partial<CreateCurrencyTypeDto>): Promise<CurrencyType | null> {
        const client = PostgresDatabase.getClient();
        const fields: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        if (updateData.name) {
            fields.push(`name = $${paramIndex++}`);
            values.push(updateData.name);
        }
        if (updateData.symbol) {
            fields.push(`symbol = $${paramIndex++}`);
            values.push(updateData.symbol);
        }

        if (fields.length === 0) {
            return await this.findById(id);
        }

        values.push(id);
        const query = `UPDATE ${this.TABLE_NAME} SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
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

