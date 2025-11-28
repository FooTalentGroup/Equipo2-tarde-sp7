import { PostgresDatabase } from '../../database';

export interface ClientConsultation {
    id?: number;
    client_id: number;
    property_id?: number;
    consultation_date?: Date;
    consultation_type_id: number;
    assigned_user_id?: number;
    message: string;
    response?: string;
    responded_by_user_id?: number;
    response_date?: Date;
}

export interface CreateClientConsultationDto {
    client_id: number;
    property_id?: number;
    consultation_type_id: number;
    assigned_user_id?: number;
    consultation_date?: Date;
    message: string;
    response?: string;
    responded_by_user_id?: number;
    response_date?: Date;
}

export interface ClientConsultationFilters {
    client_id?: number;
    property_id?: number;
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
            INSERT INTO ${this.TABLE_NAME} (
                client_id, property_id, consultation_type_id, assigned_user_id, 
                consultation_date, message, response, responded_by_user_id, response_date
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
        `;
        
        const result = await client.query(query, [
            consultationData.client_id,
            consultationData.property_id || null,
            consultationData.consultation_type_id,
            consultationData.assigned_user_id || null,
            consultationData.consultation_date || new Date(),
            consultationData.message,
            consultationData.response || null,
            consultationData.responded_by_user_id || null,
            consultationData.response_date || null,
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
            if (filters.property_id !== undefined) {
                conditions.push(`property_id = $${paramIndex++}`);
                values.push(filters.property_id);
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

    static async update(id: number, updateData: Partial<CreateClientConsultationDto>): Promise<ClientConsultation | null> {
        const client = PostgresDatabase.getClient();
        
        const fields: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        if (updateData.message !== undefined) {
            fields.push(`message = $${paramIndex++}`);
            values.push(updateData.message);
        }
        if (updateData.response !== undefined) {
            fields.push(`response = $${paramIndex++}`);
            values.push(updateData.response || null);
        }
        if (updateData.responded_by_user_id !== undefined) {
            fields.push(`responded_by_user_id = $${paramIndex++}`);
            values.push(updateData.responded_by_user_id || null);
        }
        if (updateData.response_date !== undefined) {
            fields.push(`response_date = $${paramIndex++}`);
            values.push(updateData.response_date || null);
        }
        if (updateData.property_id !== undefined) {
            fields.push(`property_id = $${paramIndex++}`);
            values.push(updateData.property_id || null);
        }
        if (updateData.assigned_user_id !== undefined) {
            fields.push(`assigned_user_id = $${paramIndex++}`);
            values.push(updateData.assigned_user_id || null);
        }
        if (updateData.consultation_type_id !== undefined) {
            fields.push(`consultation_type_id = $${paramIndex++}`);
            values.push(updateData.consultation_type_id);
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

