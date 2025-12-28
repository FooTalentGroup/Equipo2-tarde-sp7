import { PostgresDatabase } from '../../database';

export interface PropertySearchType {
    id?: number;
    name: string;
}

export interface CreatePropertySearchTypeDto {
    name: string;
}

export class PropertySearchTypeModel {
    private static readonly TABLE_NAME = 'property_search_types';

    static async create(data: CreatePropertySearchTypeDto): Promise<PropertySearchType> {
        const client = PostgresDatabase.getClient();
        const query = `INSERT INTO ${this.TABLE_NAME} (name) VALUES ($1) RETURNING *`;
        const result = await client.query(query, [data.name]);
        return result.rows[0];
    }

    static async findAll(): Promise<PropertySearchType[]> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} ORDER BY name`;
        const result = await client.query(query);
        return result.rows;
    }

    static async findById(id: number): Promise<PropertySearchType | null> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE id = $1`;
        const result = await client.query(query, [id]);
        return result.rows[0] || null;
    }

    static async findByName(name: string): Promise<PropertySearchType | null> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE name = $1`;
        const result = await client.query(query, [name]);
        return result.rows[0] || null;
    }

    static async update(id: number, updateData: Partial<CreatePropertySearchTypeDto>): Promise<PropertySearchType | null> {
        const client = PostgresDatabase.getClient();
        if (!updateData.name) {
            return await this.findById(id);
        }
        const query = `UPDATE ${this.TABLE_NAME} SET name = $1 WHERE id = $2 RETURNING *`;
        const result = await client.query(query, [updateData.name, id]);
        return result.rows[0] || null;
    }

    static async delete(id: number): Promise<boolean> {
        const client = PostgresDatabase.getClient();
        const query = `DELETE FROM ${this.TABLE_NAME} WHERE id = $1`;
        const result = await client.query(query, [id]);
        return (result.rowCount ?? 0) > 0;
    }
}

