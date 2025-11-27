import { PostgresDatabase } from '../../database';

export interface ClientConsultation {
    id?: number;
    client_id: number;
    consultation_date?: Date;
    consultation_type_id: number;
    assigned_user_id?: number;
}

export interface CreateClientConsultationDto {
    client_id: number;
    consultation_type_id: number;
    assigned_user_id?: number;
    consultation_date?: Date;
}

export interface ClientConsultationFilters {
    client_id?: number;
    consultation_type_id?: number;
    assigned_user_id?: number;
    start_date?: Date;
    end_date?: Date;
    limit?: number;
    offset?: number;
}

export class ClientConsultationModel {
    private static readonly TABLE_NAME = 'client_consultations';

    static async create(consultationData: CreateClientConsultationDto): Promise<ClientConsultation> {
        const client = PostgresDatabase.getClient();
        
        const query = `
            INSERT INTO ${this.TABLE_NAME} (client_id, consultation_type_id, assigned_user_id, consultation_date)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        
        const result = await client.query(query, [
            consultationData.client_id,
            consultationData.consultation_type_id,
            consultationData.assigned_user_id || null,
            consultationData.consultation_date || new Date(),
        ]);

        return result.rows[0];
    }

    static async findById(id: number): Promise<ClientConsultation | null> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE id = $1`;
        const result = await client.query(query, [id]);
        return result.rows[0] || null;
    }

    static async findByClientId(clientId: number): Promise<ClientConsultation[]> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE client_id = $1 ORDER BY consultation_date DESC`;
        const result = await client.query(query, [clientId]);
        return result.rows;
    }

    static async findAll(filters?: ClientConsultationFilters): Promise<ClientConsultation[]> {
        const client = PostgresDatabase.getClient();
        let query = `SELECT * FROM ${this.TABLE_NAME}`;
        const conditions: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        if (filters) {
            if (filters.client_id !== undefined) {
                conditions.push(`client_id = $${paramIndex++}`);
                values.push(filters.client_id);
            }
            if (filters.consultation_type_id !== undefined) {
                conditions.push(`consultation_type_id = $${paramIndex++}`);
                values.push(filters.consultation_type_id);
            }
            if (filters.assigned_user_id !== undefined) {
                conditions.push(`assigned_user_id = $${paramIndex++}`);
                values.push(filters.assigned_user_id);
            }
            if (filters.start_date) {
                conditions.push(`consultation_date >= $${paramIndex++}`);
                values.push(filters.start_date);
            }
            if (filters.end_date) {
                conditions.push(`consultation_date <= $${paramIndex++}`);
                values.push(filters.end_date);
            }
        }

        if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(' AND ')}`;
        }

        query += ` ORDER BY consultation_date DESC`;

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

