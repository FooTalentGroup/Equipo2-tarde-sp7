import { PostgresDatabase } from '../../database';
import { v4 as uuidv4 } from 'uuid';

export interface Amenity {
    id?: string;
    title: string;
}

export interface CreateAmenityDto {
    title: string;
}

export class AmenityModel {
    private static readonly TABLE_NAME = 'amenities';

    static async create(data: CreateAmenityDto): Promise<Amenity> {
        const client = PostgresDatabase.getClient();
        const id = uuidv4();
        const query = `INSERT INTO ${this.TABLE_NAME} (id, title) VALUES ($1, $2) RETURNING *`;
        const result = await client.query(query, [id, data.title]);
        return result.rows[0];
    }

    static async findAll(): Promise<Amenity[]> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} ORDER BY title`;
        const result = await client.query(query);
        return result.rows;
    }

    static async findById(id: string): Promise<Amenity | null> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE id = $1`;
        const result = await client.query(query, [id]);
        return result.rows[0] || null;
    }

    static async findByTitle(title: string): Promise<Amenity | null> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE title = $1`;
        const result = await client.query(query, [title]);
        return result.rows[0] || null;
    }

    static async update(id: string, updateData: Partial<CreateAmenityDto>): Promise<Amenity | null> {
        const client = PostgresDatabase.getClient();
        if (!updateData.title) {
            return await this.findById(id);
        }
        const query = `UPDATE ${this.TABLE_NAME} SET title = $1 WHERE id = $2 RETURNING *`;
        const result = await client.query(query, [updateData.title, id]);
        return result.rows[0] || null;
    }

    static async delete(id: string): Promise<boolean> {
        const client = PostgresDatabase.getClient();
        const query = `DELETE FROM ${this.TABLE_NAME} WHERE id = $1`;
        const result = await client.query(query, [id]);
        return (result.rowCount ?? 0) > 0;
    }
}


