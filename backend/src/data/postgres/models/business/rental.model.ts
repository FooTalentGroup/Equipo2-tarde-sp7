import { PostgresDatabase } from '../../database';
import { v4 as uuidv4 } from 'uuid';

export interface Rental {
    id?: string;
    property_id: string;
    client_id: string;
    start_date: Date;
    end_date: Date;
    created_at?: Date;
}

export interface CreateRentalDto {
    property_id: string;
    client_id: string;
    start_date: Date;
    end_date: Date;
}

export class RentalModel {
    private static readonly TABLE_NAME = 'rentals';

    static async create(rentalData: CreateRentalDto): Promise<Rental> {
        const client = PostgresDatabase.getClient();
        
        const id = uuidv4();
        const query = `
            INSERT INTO ${this.TABLE_NAME} (id, property_id, client_id, start_date, end_date, created_at)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        
        const values = [
            id,
            rentalData.property_id,
            rentalData.client_id,
            rentalData.start_date,
            rentalData.end_date,
            new Date()
        ];

        const result = await client.query(query, values);
        return result.rows[0];
    }

    static async findById(id: string): Promise<Rental | null> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE id = $1`;
        const result = await client.query(query, [id]);
        return result.rows[0] || null;
    }

    static async findByProperty(propertyId: string): Promise<Rental[]> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE property_id = $1 ORDER BY start_date DESC`;
        const result = await client.query(query, [propertyId]);
        return result.rows;
    }

    static async findByClient(clientId: string): Promise<Rental[]> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE client_id = $1 ORDER BY start_date DESC`;
        const result = await client.query(query, [clientId]);
        return result.rows;
    }

    static async findActiveByProperty(propertyId: string, date: Date = new Date()): Promise<Rental[]> {
        const client = PostgresDatabase.getClient();
        const query = `
            SELECT * FROM ${this.TABLE_NAME} 
            WHERE property_id = $1 
            AND start_date <= $2 
            AND end_date >= $2
            ORDER BY start_date DESC
        `;
        const result = await client.query(query, [propertyId, date]);
        return result.rows;
    }

    static async findAll(): Promise<Rental[]> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} ORDER BY start_date DESC`;
        const result = await client.query(query);
        return result.rows;
    }

    static async update(id: string, updateData: Partial<CreateRentalDto>): Promise<Rental | null> {
        const client = PostgresDatabase.getClient();
        
        const fields: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        if (updateData.property_id) {
            fields.push(`property_id = $${paramIndex++}`);
            values.push(updateData.property_id);
        }
        if (updateData.client_id) {
            fields.push(`client_id = $${paramIndex++}`);
            values.push(updateData.client_id);
        }
        if (updateData.start_date) {
            fields.push(`start_date = $${paramIndex++}`);
            values.push(updateData.start_date);
        }
        if (updateData.end_date) {
            fields.push(`end_date = $${paramIndex++}`);
            values.push(updateData.end_date);
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

    static async delete(id: string): Promise<boolean> {
        const client = PostgresDatabase.getClient();
        const query = `DELETE FROM ${this.TABLE_NAME} WHERE id = $1`;
        const result = await client.query(query, [id]);
        return (result.rowCount ?? 0) > 0;
    }
}


