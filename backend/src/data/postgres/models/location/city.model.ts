import { PostgresDatabase } from '../../database';
import { v4 as uuidv4 } from 'uuid';

export interface City {
    id?: string;
    title: string;
    id_country: string;
}

export interface CreateCityDto {
    title: string;
    id_country: string;
}

export class CityModel {
    private static readonly TABLE_NAME = 'cities';

    static async create(data: CreateCityDto): Promise<City> {
        const client = PostgresDatabase.getClient();
        const id = uuidv4();
        const query = `INSERT INTO ${this.TABLE_NAME} (id, title, id_country) VALUES ($1, $2, $3) RETURNING *`;
        const result = await client.query(query, [id, data.title, data.id_country]);
        return result.rows[0];
    }

    static async findByCountry(countryId: string): Promise<City[]> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE id_country = $1 ORDER BY title`;
        const result = await client.query(query, [countryId]);
        return result.rows;
    }

    static async findByCountryAndTitle(countryId: string, title: string): Promise<City | null> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE id_country = $1 AND title = $2`;
        const result = await client.query(query, [countryId, title]);
        return result.rows[0] || null;
    }

    static async findById(id: string): Promise<City | null> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE id = $1`;
        const result = await client.query(query, [id]);
        return result.rows[0] || null;
    }

    static async findAll(): Promise<City[]> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} ORDER BY title`;
        const result = await client.query(query);
        return result.rows;
    }

    static async update(id: string, updateData: Partial<CreateCityDto>): Promise<City | null> {
        const client = PostgresDatabase.getClient();
        
        const fields: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        if (updateData.title) {
            fields.push(`title = $${paramIndex++}`);
            values.push(updateData.title);
        }
        if (updateData.id_country) {
            fields.push(`id_country = $${paramIndex++}`);
            values.push(updateData.id_country);
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

    static async delete(id: string): Promise<boolean> {
        const client = PostgresDatabase.getClient();
        const query = `DELETE FROM ${this.TABLE_NAME} WHERE id = $1`;
        const result = await client.query(query, [id]);
        return (result.rowCount ?? 0) > 0;
    }
}


