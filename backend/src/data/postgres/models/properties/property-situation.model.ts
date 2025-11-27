import { PostgresDatabase } from '../../database';

export interface PropertySituation {
    id?: number;
    name: string;
}

export interface CreatePropertySituationDto {
    name: string;
}

export class PropertySituationModel {
    private static readonly TABLE_NAME = 'property_situations';

    static async create(data: CreatePropertySituationDto): Promise<PropertySituation> {
        const client = PostgresDatabase.getClient();
        const query = `INSERT INTO ${this.TABLE_NAME} (name) VALUES ($1) RETURNING *`;
        const result = await client.query(query, [data.name]);
        return result.rows[0];
    }

    static async findAll(): Promise<PropertySituation[]> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} ORDER BY name`;
        const result = await client.query(query);
        return result.rows;
    }

    static async findById(id: number): Promise<PropertySituation | null> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE id = $1`;
        const result = await client.query(query, [id]);
        return result.rows[0] || null;
    }

    static async findByName(name: string): Promise<PropertySituation | null> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE name = $1`;
        const result = await client.query(query, [name]);
        return result.rows[0] || null;
    }

    static async update(id: number, updateData: Partial<CreatePropertySituationDto>): Promise<PropertySituation | null> {
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

