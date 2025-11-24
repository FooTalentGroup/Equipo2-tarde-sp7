import { PostgresDatabase } from '../../database';
import { v4 as uuidv4 } from 'uuid';

export interface Lead {
    id?: string;
    property_id?: string;
    profile_id?: string;
    origin?: string;
    status_id: string;
    visitor_name?: string;
    visitor_phone?: string;
    visitor_email?: string;
    message?: string;
    created_at?: Date;
}

export interface CreateLeadDto {
    property_id?: string;
    profile_id?: string;
    origin?: string;
    status_id: string;
    visitor_name?: string;
    visitor_phone?: string;
    visitor_email?: string;
    message?: string;
}

export class LeadModel {
    private static readonly TABLE_NAME = 'leads';

    static async create(leadData: CreateLeadDto): Promise<Lead> {
        const client = PostgresDatabase.getClient();
        
        const id = uuidv4();
        const query = `
            INSERT INTO ${this.TABLE_NAME} (
                id, property_id, profile_id, origin, status_id,
                visitor_name, visitor_phone, visitor_email, message, created_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *
        `;
        
        const values = [
            id,
            leadData.property_id || null,
            leadData.profile_id || null,
            leadData.origin || null,
            leadData.status_id,
            leadData.visitor_name || null,
            leadData.visitor_phone || null,
            leadData.visitor_email || null,
            leadData.message || null,
            new Date()
        ];

        const result = await client.query(query, values);
        return result.rows[0];
    }

    static async findById(id: string): Promise<Lead | null> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE id = $1`;
        const result = await client.query(query, [id]);
        return result.rows[0] || null;
    }

    static async findByProperty(propertyId: string): Promise<Lead[]> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE property_id = $1 ORDER BY created_at DESC`;
        const result = await client.query(query, [propertyId]);
        return result.rows;
    }

    static async findByStatus(statusId: string): Promise<Lead[]> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE status_id = $1 ORDER BY created_at DESC`;
        const result = await client.query(query, [statusId]);
        return result.rows;
    }

    static async update(id: string, updateData: Partial<CreateLeadDto>): Promise<Lead | null> {
        const client = PostgresDatabase.getClient();
        
        const fields: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        if (updateData.property_id !== undefined) {
            fields.push(`property_id = $${paramIndex++}`);
            values.push(updateData.property_id || null);
        }
        if (updateData.profile_id !== undefined) {
            fields.push(`profile_id = $${paramIndex++}`);
            values.push(updateData.profile_id || null);
        }
        if (updateData.origin !== undefined) {
            fields.push(`origin = $${paramIndex++}`);
            values.push(updateData.origin || null);
        }
        if (updateData.status_id) {
            fields.push(`status_id = $${paramIndex++}`);
            values.push(updateData.status_id);
        }
        if (updateData.visitor_name !== undefined) {
            fields.push(`visitor_name = $${paramIndex++}`);
            values.push(updateData.visitor_name || null);
        }
        if (updateData.visitor_phone !== undefined) {
            fields.push(`visitor_phone = $${paramIndex++}`);
            values.push(updateData.visitor_phone || null);
        }
        if (updateData.visitor_email !== undefined) {
            fields.push(`visitor_email = $${paramIndex++}`);
            values.push(updateData.visitor_email || null);
        }
        if (updateData.message !== undefined) {
            fields.push(`message = $${paramIndex++}`);
            values.push(updateData.message || null);
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

    static async findAll(): Promise<Lead[]> {
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


