import { PostgresDatabase } from '../../database';

export interface Province {
    id?: number;
    name: string;
    country_id: number;
}

export interface CreateProvinceDto {
    name: string;
    country_id: number;
}

export class ProvinceModel {
    private static readonly TABLE_NAME = 'provinces';

    static async create(data: CreateProvinceDto): Promise<Province> {
        const client = PostgresDatabase.getClient();
        const query = `INSERT INTO ${this.TABLE_NAME} (name, country_id) VALUES ($1, $2) RETURNING *`;
        const result = await client.query(query, [data.name, data.country_id]);
        return result.rows[0];
    }

    static async findAll(): Promise<Province[]> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} ORDER BY name`;
        const result = await client.query(query);
        return result.rows;
    }

    static async findById(id: number): Promise<Province | null> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE id = $1`;
        const result = await client.query(query, [id]);
        return result.rows[0] || null;
    }

    static async findByCountryId(countryId: number): Promise<Province[]> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE country_id = $1 ORDER BY name`;
        const result = await client.query(query, [countryId]);
        return result.rows;
    }

    static async findByName(name: string): Promise<Province | null> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE name = $1`;
        const result = await client.query(query, [name]);
        return result.rows[0] || null;
    }

    static async update(id: number, updateData: Partial<CreateProvinceDto>): Promise<Province | null> {
        const client = PostgresDatabase.getClient();
        const fields: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        if (updateData.name) {
            fields.push(`name = $${paramIndex++}`);
            values.push(updateData.name);
        }
        if (updateData.country_id !== undefined) {
            fields.push(`country_id = $${paramIndex++}`);
            values.push(updateData.country_id);
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

