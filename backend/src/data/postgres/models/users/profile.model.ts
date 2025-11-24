import { PostgresDatabase } from '../../database';
import { v4 as uuidv4 } from 'uuid';

export interface Profile {
    id?: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone?: string;
    created_at?: Date;
    updated_at?: Date;
    role_id?: string;
    whatsapp_number?: string;
}

export interface CreateProfileDto {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone?: string;
    role_id?: string;
    whatsapp_number?: string;
}

export class ProfileModel {
    private static readonly TABLE_NAME = 'profiles';

    static async create(profileData: CreateProfileDto): Promise<Profile> {
        const client = PostgresDatabase.getClient();
        
        const id = uuidv4();
        const query = `
            INSERT INTO ${this.TABLE_NAME} (id, first_name, last_name, email, password, phone, role_id, whatsapp_number, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *
        `;
        
        const values = [
            id,
            profileData.first_name,
            profileData.last_name,
            profileData.email,
            profileData.password,
            profileData.phone || null,
            profileData.role_id || null,
            profileData.whatsapp_number || null,
            new Date(),
            new Date()
        ];

        const result = await client.query(query, values);
        return result.rows[0];
    }

    static async findByEmail(email: string): Promise<Profile | null> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE email = $1`;
        const result = await client.query(query, [email]);
        return result.rows[0] || null;
    }

    static async findById(id: string): Promise<Profile | null> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE id = $1`;
        const result = await client.query(query, [id]);
        return result.rows[0] || null;
    }

    static async update(id: string, updateData: Partial<CreateProfileDto>): Promise<Profile | null> {
        const client = PostgresDatabase.getClient();
        
        const fields: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        if (updateData.first_name) {
            fields.push(`first_name = $${paramIndex++}`);
            values.push(updateData.first_name);
        }
        if (updateData.last_name) {
            fields.push(`last_name = $${paramIndex++}`);
            values.push(updateData.last_name);
        }
        if (updateData.email) {
            fields.push(`email = $${paramIndex++}`);
            values.push(updateData.email);
        }
        if (updateData.phone !== undefined) {
            fields.push(`phone = $${paramIndex++}`);
            values.push(updateData.phone || null);
        }
        if (updateData.role_id !== undefined) {
            fields.push(`role_id = $${paramIndex++}`);
            values.push(updateData.role_id || null);
        }
        if (updateData.whatsapp_number !== undefined) {
            fields.push(`whatsapp_number = $${paramIndex++}`);
            values.push(updateData.whatsapp_number || null);
        }

        if (fields.length === 0) {
            return await this.findById(id);
        }

        fields.push(`updated_at = $${paramIndex++}`);
        values.push(new Date());
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

    static async findAll(): Promise<Profile[]> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} ORDER BY created_at DESC`;
        const result = await client.query(query);
        return result.rows;
    }

    static async delete(id: string): Promise<boolean> {
        const client = PostgresDatabase.getClient();
        const query = `DELETE FROM ${this.TABLE_NAME} WHERE id = $1`;
        const result = await client.query(query, [id]);
        return (result.rowCount ?? 0) > 0;
    }
}

