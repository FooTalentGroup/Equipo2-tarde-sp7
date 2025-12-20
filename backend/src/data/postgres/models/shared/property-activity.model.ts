import { PostgresDatabase } from '../../database';
import { SqlParams } from '../../../types/sql.types';

export interface PropertyActivity {
    id?: number;
    property_id: number;
    user_id: number;
    action_type?: string;
    title?: string;
    description?: string;
    activity_date?: Date;
}

export interface CreatePropertyActivityDto {
    property_id: number;
    user_id: number;
    action_type?: string;
    title?: string;
    description?: string;
    activity_date?: Date;
}

export interface PropertyActivityFilters {
    property_id?: number;
    user_id?: number;
    action_type?: string;
    start_date?: Date;
    end_date?: Date;
    limit?: number;
    offset?: number;
}

export class PropertyActivityModel {
    private static readonly TABLE_NAME = 'property_activities';

    static async create(activityData: CreatePropertyActivityDto): Promise<PropertyActivity> {
        const client = PostgresDatabase.getClient();
        
        const query = `
            INSERT INTO ${this.TABLE_NAME} (
                property_id, user_id, action_type, title, description, activity_date
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        
        const result = await client.query(query, [
            activityData.property_id,
            activityData.user_id,
            activityData.action_type || null,
            activityData.title || null,
            activityData.description || null,
            activityData.activity_date || new Date(),
        ]);

        return result.rows[0];
    }

    static async findById(id: number): Promise<PropertyActivity | null> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE id = $1`;
        const result = await client.query(query, [id]);
        return result.rows[0] || null;
    }

    static async findByPropertyId(propertyId: number): Promise<PropertyActivity[]> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE property_id = $1 ORDER BY activity_date DESC`;
        const result = await client.query(query, [propertyId]);
        return result.rows;
    }

    static async findAll(filters?: PropertyActivityFilters): Promise<PropertyActivity[]> {
        const client = PostgresDatabase.getClient();
        let query = `SELECT * FROM ${this.TABLE_NAME}`;
        const conditions: string[] = [];
        const values: SqlParams = [];
        let paramIndex = 1;

        if (filters) {
            if (filters.property_id !== undefined) {
                conditions.push(`property_id = $${paramIndex++}`);
                values.push(filters.property_id);
            }
            if (filters.user_id !== undefined) {
                conditions.push(`user_id = $${paramIndex++}`);
                values.push(filters.user_id);
            }
            if (filters.action_type) {
                conditions.push(`action_type = $${paramIndex++}`);
                values.push(filters.action_type);
            }
            if (filters.start_date) {
                conditions.push(`activity_date >= $${paramIndex++}`);
                values.push(filters.start_date);
            }
            if (filters.end_date) {
                conditions.push(`activity_date <= $${paramIndex++}`);
                values.push(filters.end_date);
            }
        }

        if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(' AND ')}`;
        }

        query += ` ORDER BY activity_date DESC`;

        if (filters?.limit) {
            query += ` LIMIT $${paramIndex++}`;
            values.push(filters.limit);
            if (filters.offset) {
                query += ` OFFSET $${paramIndex++}`;
                values.push(filters.offset);
            }
        }

        const result = await client.query(query, values);
        return result.rows;
    }

    static async delete(id: number): Promise<boolean> {
        const client = PostgresDatabase.getClient();
        const query = `DELETE FROM ${this.TABLE_NAME} WHERE id = $1`;
        const result = await client.query(query, [id]);
        return (result.rowCount ?? 0) > 0;
    }
}

