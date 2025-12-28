import { PostgresDatabase } from '../../database';
import { SqlParams } from '../../../types/sql.types';

export interface City {
    id?: number;
    name: string;
    province_id: number;
}

export interface CreateCityDto {
    name: string;
    province_id: number;
}

export class CityModel {
    private static readonly TABLE_NAME = 'cities';

    static async create(data: CreateCityDto): Promise<City> {
        const client = PostgresDatabase.getClient();
        const query = `INSERT INTO ${this.TABLE_NAME} (name, province_id) VALUES ($1, $2) RETURNING *`;
        const result = await client.query(query, [data.name, data.province_id]);
        return result.rows[0];
    }

    static async findAll(): Promise<City[]> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} ORDER BY name`;
        const result = await client.query(query);
        return result.rows;
    }

    static async findById(id: number): Promise<City | null> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE id = $1`;
        const result = await client.query(query, [id]);
        return result.rows[0] || null;
    }

    static async findByProvinceId(provinceId: number): Promise<City[]> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE province_id = $1 ORDER BY name`;
        const result = await client.query(query, [provinceId]);
        return result.rows;
    }

    static async findByNameAndProvince(name: string, provinceId: number): Promise<City | null> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE name = $1 AND province_id = $2`;
        const result = await client.query(query, [name, provinceId]);
        return result.rows[0] || null;
    }

    static async update(id: number, updateData: Partial<CreateCityDto>): Promise<City | null> {
        const client = PostgresDatabase.getClient();
        const fields: string[] = [];
        const values: SqlParams = [];
        let paramIndex = 1;

        if (updateData.name) {
            fields.push(`name = $${paramIndex++}`);
            values.push(updateData.name);
        }
        if (updateData.province_id !== undefined) {
            fields.push(`province_id = $${paramIndex++}`);
            values.push(updateData.province_id);
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

