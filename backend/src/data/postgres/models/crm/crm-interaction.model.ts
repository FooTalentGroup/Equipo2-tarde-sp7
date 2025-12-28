import { PostgresDatabase } from '../../database';
import { SqlParams } from '../../../types/sql.types';

export interface CrmInteraction {
    id?: number;
    event_type_id: number;
    title: string;
    scheduled_datetime: Date;
    client_id?: number;
    property_id?: number;
    responsible_user_id: number;
    comments?: string;
    status?: string;
}

export interface CreateCrmInteractionDto {
    event_type_id: number;
    title: string;
    scheduled_datetime: Date;
    client_id?: number;
    property_id?: number;
    responsible_user_id: number;
    comments?: string;
    status?: string;
}

export interface CrmInteractionFilters {
    event_type_id?: number;
    client_id?: number;
    property_id?: number;
    responsible_user_id?: number;
    status?: string;
    start_datetime?: Date;
    end_datetime?: Date;
    upcoming?: boolean; 
    limit?: number;
    offset?: number;
}

export class CrmInteractionModel {
    private static readonly TABLE_NAME = 'crm_interactions';

    static async create(interactionData: CreateCrmInteractionDto): Promise<CrmInteraction> {
        const client = PostgresDatabase.getClient();
        
        const query = `
            INSERT INTO ${this.TABLE_NAME} (
                event_type_id, title, scheduled_datetime, client_id, property_id,
                responsible_user_id, comments, status
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `;
        
        const result = await client.query(query, [
            interactionData.event_type_id,
            interactionData.title,
            interactionData.scheduled_datetime,
            interactionData.client_id || null,
            interactionData.property_id || null,
            interactionData.responsible_user_id,
            interactionData.comments || null,
            interactionData.status || 'Scheduled',
        ]);

        return result.rows[0];
    }

    static async findById(id: number): Promise<CrmInteraction | null> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE id = $1`;
        const result = await client.query(query, [id]);
        return result.rows[0] || null;
    }

    static async findAll(filters?: CrmInteractionFilters): Promise<CrmInteraction[]> {
        const client = PostgresDatabase.getClient();
        let query = `SELECT * FROM ${this.TABLE_NAME}`;
        const conditions: string[] = [];
        const values: SqlParams = [];
        let paramIndex = 1;

        if (filters) {
            if (filters.event_type_id !== undefined) {
                conditions.push(`event_type_id = $${paramIndex++}`);
                values.push(filters.event_type_id);
            }
            if (filters.client_id !== undefined) {
                conditions.push(`client_id = $${paramIndex++}`);
                values.push(filters.client_id);
            }
            if (filters.property_id !== undefined) {
                conditions.push(`property_id = $${paramIndex++}`);
                values.push(filters.property_id);
            }
            if (filters.responsible_user_id !== undefined) {
                conditions.push(`responsible_user_id = $${paramIndex++}`);
                values.push(filters.responsible_user_id);
            }
            if (filters.status) {
                conditions.push(`status = $${paramIndex++}`);
                values.push(filters.status);
            }
            if (filters.start_datetime) {
                conditions.push(`scheduled_datetime >= $${paramIndex++}`);
                values.push(filters.start_datetime);
            }
            if (filters.end_datetime) {
                conditions.push(`scheduled_datetime <= $${paramIndex++}`);
                values.push(filters.end_datetime);
            }
            if (filters.upcoming !== undefined) {
                if (filters.upcoming) {
                    conditions.push(`scheduled_datetime >= CURRENT_TIMESTAMP`);
                } else {
                    conditions.push(`scheduled_datetime < CURRENT_TIMESTAMP`);
                }
            }
        }

        if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(' AND ')}`;
        }

        query += ` ORDER BY scheduled_datetime ASC`;

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

    static async update(id: number, updateData: Partial<CreateCrmInteractionDto>): Promise<CrmInteraction | null> {
        const client = PostgresDatabase.getClient();
        
        const fields: string[] = [];
        const values: SqlParams = [];
        let paramIndex = 1;

        if (updateData.title) {
            fields.push(`title = $${paramIndex++}`);
            values.push(updateData.title);
        }
        if (updateData.scheduled_datetime) {
            fields.push(`scheduled_datetime = $${paramIndex++}`);
            values.push(updateData.scheduled_datetime);
        }
        if (updateData.comments !== undefined) {
            fields.push(`comments = $${paramIndex++}`);
            values.push(updateData.comments || null);
        }
        if (updateData.status !== undefined) {
            fields.push(`status = $${paramIndex++}`);
            values.push(updateData.status);
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

    static async delete(id: number): Promise<boolean> {
        const client = PostgresDatabase.getClient();
        const query = `DELETE FROM ${this.TABLE_NAME} WHERE id = $1`;
        const result = await client.query(query, [id]);
        return (result.rowCount ?? 0) > 0;
    }
}

