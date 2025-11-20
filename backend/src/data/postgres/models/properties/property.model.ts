import { PostgresDatabase } from '../../database';
import { v4 as uuidv4 } from 'uuid';

export interface Property {
    id?: string;
    title: string;
    description?: string;
    price: number;
    bedrooms?: number;
    bathrooms?: number;
    owner_id: string;
    client_id?: string;
    address_id: string;
    created_at?: Date;
    updated_at?: Date;
    status_id?: string;
    property_type_id?: string;
    operation_type_id?: string;
}

export interface CreatePropertyDto {
    title: string;
    description?: string;
    price: number;
    bedrooms?: number;
    bathrooms?: number;
    owner_id: string;
    client_id?: string;
    address_id: string;
    status_id?: string;
    property_type_id?: string;
    operation_type_id?: string;
}

export class PropertyModel {
    private static readonly TABLE_NAME = 'properties';

    static async create(propertyData: CreatePropertyDto): Promise<Property> {
        const client = PostgresDatabase.getClient();
        
        const id = uuidv4();
        const query = `
            INSERT INTO ${this.TABLE_NAME} (
                id, title, description, price, bedrooms, bathrooms,
                owner_id, client_id, address_id, status_id,
                property_type_id, operation_type_id, created_at, updated_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            RETURNING *
        `;
        
        const values = [
            id,
            propertyData.title,
            propertyData.description || null,
            propertyData.price,
            propertyData.bedrooms || null,
            propertyData.bathrooms || null,
            propertyData.owner_id,
            propertyData.client_id || null,
            propertyData.address_id,
            propertyData.status_id || null,
            propertyData.property_type_id || null,
            propertyData.operation_type_id || null,
            new Date(),
            new Date()
        ];

        const result = await client.query(query, values);
        return result.rows[0];
    }

    static async findById(id: string): Promise<Property | null> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE id = $1`;
        const result = await client.query(query, [id]);
        return result.rows[0] || null;
    }

    static async findByOwnerId(ownerId: string): Promise<Property[]> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE owner_id = $1 ORDER BY created_at DESC`;
        const result = await client.query(query, [ownerId]);
        return result.rows;
    }

    static async findByStatus(statusId: string): Promise<Property[]> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE status_id = $1 ORDER BY created_at DESC`;
        const result = await client.query(query, [statusId]);
        return result.rows;
    }

    static async update(id: string, updateData: Partial<CreatePropertyDto>): Promise<Property | null> {
        const client = PostgresDatabase.getClient();
        
        const fields: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        if (updateData.title) {
            fields.push(`title = $${paramIndex++}`);
            values.push(updateData.title);
        }
        if (updateData.description !== undefined) {
            fields.push(`description = $${paramIndex++}`);
            values.push(updateData.description || null);
        }
        if (updateData.price !== undefined) {
            fields.push(`price = $${paramIndex++}`);
            values.push(updateData.price);
        }
        if (updateData.bedrooms !== undefined) {
            fields.push(`bedrooms = $${paramIndex++}`);
            values.push(updateData.bedrooms || null);
        }
        if (updateData.bathrooms !== undefined) {
            fields.push(`bathrooms = $${paramIndex++}`);
            values.push(updateData.bathrooms || null);
        }
        if (updateData.owner_id) {
            fields.push(`owner_id = $${paramIndex++}`);
            values.push(updateData.owner_id);
        }
        if (updateData.client_id !== undefined) {
            fields.push(`client_id = $${paramIndex++}`);
            values.push(updateData.client_id || null);
        }
        if (updateData.address_id) {
            fields.push(`address_id = $${paramIndex++}`);
            values.push(updateData.address_id);
        }
        if (updateData.status_id !== undefined) {
            fields.push(`status_id = $${paramIndex++}`);
            values.push(updateData.status_id || null);
        }
        if (updateData.property_type_id !== undefined) {
            fields.push(`property_type_id = $${paramIndex++}`);
            values.push(updateData.property_type_id || null);
        }
        if (updateData.operation_type_id !== undefined) {
            fields.push(`operation_type_id = $${paramIndex++}`);
            values.push(updateData.operation_type_id || null);
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

    static async findAll(): Promise<Property[]> {
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


