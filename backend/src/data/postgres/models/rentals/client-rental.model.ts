import { PostgresDatabase } from '../../database';
import { SqlParams } from '../../../types/sql.types';

export interface ClientRental {
    id?: number;
    client_id: number;
    property_id: number;
    external_reference?: string;
    contract_start_date?: Date;
    contract_end_date?: Date;
    next_increase_date?: Date;
    remind_increase?: boolean;
    remind_contract_end?: boolean;
}

export interface CreateClientRentalDto {
    client_id: number;
    property_id: number;
    external_reference?: string;
    contract_start_date?: Date;
    contract_end_date?: Date;
    next_increase_date?: Date;
    remind_increase?: boolean;
    remind_contract_end?: boolean;
}

export class ClientRentalModel {
    private static readonly TABLE_NAME = 'client_rentals';

    static async create(rentalData: CreateClientRentalDto): Promise<ClientRental> {
        const client = PostgresDatabase.getClient();
        
        const query = `
            INSERT INTO ${this.TABLE_NAME} (
                client_id, property_id, external_reference, contract_start_date,
                contract_end_date, next_increase_date, remind_increase, remind_contract_end
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `;
        
        const result = await client.query(query, [
            rentalData.client_id,
            rentalData.property_id,
            rentalData.external_reference || null,
            rentalData.contract_start_date || null,
            rentalData.contract_end_date || null,
            rentalData.next_increase_date || null,
            rentalData.remind_increase !== undefined ? rentalData.remind_increase : false,
            rentalData.remind_contract_end !== undefined ? rentalData.remind_contract_end : false,
        ]);

        return result.rows[0];
    }

    static async findById(id: number): Promise<ClientRental | null> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE id = $1`;
        const result = await client.query(query, [id]);
        return result.rows[0] || null;
    }

    static async findByClientId(clientId: number): Promise<ClientRental[]> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE client_id = $1 ORDER BY contract_start_date DESC`;
        const result = await client.query(query, [clientId]);
        return result.rows;
    }

    static async findByPropertyId(propertyId: number): Promise<ClientRental[]> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE property_id = $1 ORDER BY contract_start_date DESC`;
        const result = await client.query(query, [propertyId]);
        return result.rows;
    }

    static async update(id: number, updateData: Partial<CreateClientRentalDto>): Promise<ClientRental | null> {
        const client = PostgresDatabase.getClient();
        
        const fields: string[] = [];
        const values: SqlParams = [];
        let paramIndex = 1;

        if (updateData.external_reference !== undefined) {
            fields.push(`external_reference = $${paramIndex++}`);
            values.push(updateData.external_reference || null);
        }
        if (updateData.contract_start_date !== undefined) {
            fields.push(`contract_start_date = $${paramIndex++}`);
            values.push(updateData.contract_start_date || null);
        }
        if (updateData.contract_end_date !== undefined) {
            fields.push(`contract_end_date = $${paramIndex++}`);
            values.push(updateData.contract_end_date || null);
        }
        if (updateData.next_increase_date !== undefined) {
            fields.push(`next_increase_date = $${paramIndex++}`);
            values.push(updateData.next_increase_date || null);
        }
        if (updateData.remind_increase !== undefined) {
            fields.push(`remind_increase = $${paramIndex++}`);
            values.push(updateData.remind_increase);
        }
        if (updateData.remind_contract_end !== undefined) {
            fields.push(`remind_contract_end = $${paramIndex++}`);
            values.push(updateData.remind_contract_end);
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

