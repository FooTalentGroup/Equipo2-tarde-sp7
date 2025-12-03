import { PostgresDatabase } from '../../database';

export interface AuditLog {
    id?: number;
    affected_table: string;
    affected_record_id: number;
    action: string;
    previous_data?: any;
    new_data?: any;
    changed_at?: Date;
    user_id: number;
}

export interface CreateAuditLogDto {
    affected_table: string;
    affected_record_id: number;
    action: string;
    previous_data?: any;
    new_data?: any;
    user_id: number;
}

export interface AuditLogFilters {
    affected_table?: string;
    affected_record_id?: number;
    action?: string;
    user_id?: number;
    start_date?: Date;
    end_date?: Date;
    limit?: number;
    offset?: number;
}

export class AuditLogModel {
    private static readonly TABLE_NAME = 'audit_logs';

    static async create(logData: CreateAuditLogDto): Promise<AuditLog> {
        const client = PostgresDatabase.getClient();
        
        const query = `
            INSERT INTO ${this.TABLE_NAME} (
                affected_table, affected_record_id, action, previous_data, new_data, user_id, changed_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
            RETURNING *
        `;
        
        const result = await client.query(query, [
            logData.affected_table,
            logData.affected_record_id,
            logData.action,
            logData.previous_data ? JSON.stringify(logData.previous_data) : null,
            logData.new_data ? JSON.stringify(logData.new_data) : null,
            logData.user_id,
        ]);

        // Parse JSONB fields
        const row = result.rows[0];
        if (row.previous_data) row.previous_data = typeof row.previous_data === 'string' ? JSON.parse(row.previous_data) : row.previous_data;
        if (row.new_data) row.new_data = typeof row.new_data === 'string' ? JSON.parse(row.new_data) : row.new_data;

        return row;
    }

    static async findById(id: number): Promise<AuditLog | null> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE id = $1`;
        const result = await client.query(query, [id]);
        
        if (result.rows[0]) {
            const row = result.rows[0];
            if (row.previous_data) row.previous_data = typeof row.previous_data === 'string' ? JSON.parse(row.previous_data) : row.previous_data;
            if (row.new_data) row.new_data = typeof row.new_data === 'string' ? JSON.parse(row.new_data) : row.new_data;
            return row;
        }
        return null;
    }

    static async findAll(filters?: AuditLogFilters): Promise<AuditLog[]> {
        const client = PostgresDatabase.getClient();
        let query = `SELECT * FROM ${this.TABLE_NAME}`;
        const conditions: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        if (filters) {
            if (filters.affected_table) {
                conditions.push(`affected_table = $${paramIndex++}`);
                values.push(filters.affected_table);
            }
            if (filters.affected_record_id !== undefined) {
                conditions.push(`affected_record_id = $${paramIndex++}`);
                values.push(filters.affected_record_id);
            }
            if (filters.action) {
                conditions.push(`action = $${paramIndex++}`);
                values.push(filters.action);
            }
            if (filters.user_id !== undefined) {
                conditions.push(`user_id = $${paramIndex++}`);
                values.push(filters.user_id);
            }
            if (filters.start_date) {
                conditions.push(`changed_at >= $${paramIndex++}`);
                values.push(filters.start_date);
            }
            if (filters.end_date) {
                conditions.push(`changed_at <= $${paramIndex++}`);
                values.push(filters.end_date);
            }
        }

        if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(' AND ')}`;
        }

        query += ` ORDER BY changed_at DESC`;

        if (filters?.limit) {
            query += ` LIMIT $${paramIndex++}`;
            values.push(filters.limit);
            if (filters.offset) {
                query += ` OFFSET $${paramIndex++}`;
                values.push(filters.offset);
            }
        }

        const result = await client.query(query, values);
        
        // Parse JSONB fields
        return result.rows.map(row => {
            if (row.previous_data) row.previous_data = typeof row.previous_data === 'string' ? JSON.parse(row.previous_data) : row.previous_data;
            if (row.new_data) row.new_data = typeof row.new_data === 'string' ? JSON.parse(row.new_data) : row.new_data;
            return row;
        });
    }

    static async delete(id: number): Promise<boolean> {
        const client = PostgresDatabase.getClient();
        const query = `DELETE FROM ${this.TABLE_NAME} WHERE id = $1`;
        const result = await client.query(query, [id]);
        return (result.rowCount ?? 0) > 0;
    }
}

