import { PostgresDatabase } from '../../database';
import { v4 as uuidv4 } from 'uuid';

export interface AuditLog {
    id?: string;
    profile_id?: string;
    action_type: string;
    table_name?: string;
    record_id?: string;
    changed_data?: any;
    created_at?: Date;
}

export interface CreateAuditLogDto {
    profile_id?: string;
    action_type: string;
    table_name?: string;
    record_id?: string;
    changed_data?: any;
}

export class AuditLogModel {
    private static readonly TABLE_NAME = 'audit_log';

    static async create(logData: CreateAuditLogDto): Promise<AuditLog> {
        const client = PostgresDatabase.getClient();
        
        const id = uuidv4();
        const query = `
            INSERT INTO ${this.TABLE_NAME} (
                id, profile_id, action_type, table_name, record_id, 
                changed_data, created_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `;
        
        const values = [
            id,
            logData.profile_id || null,
            logData.action_type,
            logData.table_name || null,
            logData.record_id || null,
            logData.changed_data ? JSON.stringify(logData.changed_data) : null,
            new Date()
        ];

        const result = await client.query(query, values);
        return result.rows[0];
    }

    static async findById(id: string): Promise<AuditLog | null> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE id = $1`;
        const result = await client.query(query, [id]);
        return result.rows[0] || null;
    }

    static async findByProfile(profileId: string): Promise<AuditLog[]> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE profile_id = $1 ORDER BY created_at DESC`;
        const result = await client.query(query, [profileId]);
        return result.rows;
    }

    static async findByTable(tableName: string): Promise<AuditLog[]> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE table_name = $1 ORDER BY created_at DESC`;
        const result = await client.query(query, [tableName]);
        return result.rows;
    }

    static async findByRecord(tableName: string, recordId: string): Promise<AuditLog[]> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE table_name = $1 AND record_id = $2 ORDER BY created_at DESC`;
        const result = await client.query(query, [tableName, recordId]);
        return result.rows;
    }

    static async findAll(): Promise<AuditLog[]> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} ORDER BY created_at DESC`;
        const result = await client.query(query);
        return result.rows;
    }
}

