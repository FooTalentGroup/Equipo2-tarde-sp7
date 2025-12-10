import { PostgresDatabase } from '../../database';

export interface ClientPropertyInterest {
    id?: number;
    client_id: number;
    property_id: number;
    created_at?: Date;
    notes?: string;
}

export interface CreateClientPropertyInterestDto {
    client_id: number;
    property_id: number;
    notes?: string;
}

export class ClientPropertyInterestModel {
    private static readonly TABLE_NAME = 'client_property_interests';

    static async create(interestData: CreateClientPropertyInterestDto): Promise<ClientPropertyInterest> {
        const client = PostgresDatabase.getClient();
        
        const query = `
            INSERT INTO ${this.TABLE_NAME} (
                client_id, property_id, notes
            )
            VALUES ($1, $2, $3)
            ON CONFLICT (client_id, property_id) DO NOTHING
            RETURNING *
        `;
        
        const result = await client.query(query, [
            interestData.client_id,
            interestData.property_id,
            interestData.notes || null,
        ]);

        // Si no se insertó por conflicto, obtener el registro existente
        if (result.rows.length === 0) {
            return await this.findByClientAndProperty(interestData.client_id, interestData.property_id) || {
                client_id: interestData.client_id,
                property_id: interestData.property_id,
                notes: interestData.notes,
            };
        }

        return result.rows[0];
    }

    static async findById(id: number): Promise<ClientPropertyInterest | null> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE id = $1`;
        const result = await client.query(query, [id]);
        return result.rows[0] || null;
    }

    static async findByClientId(clientId: number): Promise<ClientPropertyInterest[]> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE client_id = $1 ORDER BY created_at DESC`;
        const result = await client.query(query, [clientId]);
        return result.rows;
    }

    static async findByPropertyId(propertyId: number): Promise<ClientPropertyInterest[]> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE property_id = $1 ORDER BY created_at DESC`;
        const result = await client.query(query, [propertyId]);
        return result.rows;
    }

    static async findByClientAndProperty(clientId: number, propertyId: number): Promise<ClientPropertyInterest | null> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE client_id = $1 AND property_id = $2`;
        const result = await client.query(query, [clientId, propertyId]);
        return result.rows[0] || null;
    }

    static async delete(id: number): Promise<boolean> {
        const client = PostgresDatabase.getClient();
        const query = `DELETE FROM ${this.TABLE_NAME} WHERE id = $1`;
        const result = await client.query(query, [id]);
        return (result.rowCount ?? 0) > 0;
    }

    static async deleteByClientAndProperty(clientId: number, propertyId: number): Promise<boolean> {
        const client = PostgresDatabase.getClient();
        const query = `DELETE FROM ${this.TABLE_NAME} WHERE client_id = $1 AND property_id = $2`;
        const result = await client.query(query, [clientId, propertyId]);
        return (result.rowCount ?? 0) > 0;
    }
}



