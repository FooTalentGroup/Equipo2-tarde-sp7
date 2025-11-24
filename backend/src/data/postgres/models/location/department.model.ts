import { PostgresDatabase } from '../../database';
import { v4 as uuidv4 } from 'uuid';

export interface Department {
    id?: string;
    title: string;
    id_city: string;
}

export interface CreateDepartmentDto {
    title: string;
    id_city: string;
}

export class DepartmentModel {
    private static readonly TABLE_NAME = 'departments';

    static async create(data: CreateDepartmentDto): Promise<Department> {
        const client = PostgresDatabase.getClient();
        const id = uuidv4();
        const query = `INSERT INTO ${this.TABLE_NAME} (id, title, id_city) VALUES ($1, $2, $3) RETURNING *`;
        const result = await client.query(query, [id, data.title, data.id_city]);
        return result.rows[0];
    }

    static async findByCity(cityId: string): Promise<Department[]> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE id_city = $1 ORDER BY title`;
        const result = await client.query(query, [cityId]);
        return result.rows;
    }

    static async findByCityAndTitle(cityId: string, title: string): Promise<Department | null> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE id_city = $1 AND title = $2`;
        const result = await client.query(query, [cityId, title]);
        return result.rows[0] || null;
    }

    static async findById(id: string): Promise<Department | null> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE id = $1`;
        const result = await client.query(query, [id]);
        return result.rows[0] || null;
    }

    static async findAll(): Promise<Department[]> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} ORDER BY title`;
        const result = await client.query(query);
        return result.rows;
    }

    static async update(id: string, updateData: Partial<CreateDepartmentDto>): Promise<Department | null> {
        const client = PostgresDatabase.getClient();
        
        const fields: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        if (updateData.title) {
            fields.push(`title = $${paramIndex++}`);
            values.push(updateData.title);
        }
        if (updateData.id_city) {
            fields.push(`id_city = $${paramIndex++}`);
            values.push(updateData.id_city);
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


