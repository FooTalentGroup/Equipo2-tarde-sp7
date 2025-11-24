import { PostgresDatabase } from '../../database';
import { v4 as uuidv4 } from 'uuid';

export interface Client {
    id?: string;
    first_name: string;
    last_name: string;
    email?: string;
    phone?: string;
    created_at?: Date;
    updated_at?: Date;
    dni?: string;
}

export interface CreateClientDto {
    first_name: string;
    last_name: string;
    email?: string;
    phone?: string;
    dni?: string;
}

export class ClientModel {
    private static readonly TABLE_NAME = 'clients';

    static async create(clientData: CreateClientDto): Promise<Client> {
        const client = PostgresDatabase.getClient();
        
        const id = uuidv4();
        const query = `
            INSERT INTO ${this.TABLE_NAME} (id, first_name, last_name, email, phone, dni, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `;
        
        const values = [
            id,
            clientData.first_name,
            clientData.last_name,
            clientData.email || null,
            clientData.phone || null,
            clientData.dni || null,
            new Date(),
            new Date()
        ];

        const result = await client.query(query, values);
        return result.rows[0];
    }

    static async findByEmail(email: string): Promise<Client | null> {
        const dbClient = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE email = $1`;
        const result = await dbClient.query(query, [email]);
        return result.rows[0] || null;
    }

    static async findByDni(dni: string): Promise<Client | null> {
        const dbClient = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE dni = $1`;
        const result = await dbClient.query(query, [dni]);
        return result.rows[0] || null;
    }

    static async findById(id: string): Promise<Client | null> {
        const dbClient = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE id = $1`;
        const result = await dbClient.query(query, [id]);
        return result.rows[0] || null;
    }

    static async update(id: string, updateData: Partial<CreateClientDto>): Promise<Client | null> {
        const dbClient = PostgresDatabase.getClient();
        
        const fields: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        if (updateData.first_name) {
            fields.push(`first_name = $${paramIndex++}`);
            values.push(updateData.first_name);
        }
        if (updateData.last_name) {
            fields.push(`last_name = $${paramIndex++}`);
            values.push(updateData.last_name);
        }
        if (updateData.email !== undefined) {
            fields.push(`email = $${paramIndex++}`);
            values.push(updateData.email || null);
        }
        if (updateData.phone !== undefined) {
            fields.push(`phone = $${paramIndex++}`);
            values.push(updateData.phone || null);
        }
        if (updateData.dni !== undefined) {
            fields.push(`dni = $${paramIndex++}`);
            values.push(updateData.dni || null);
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

        const result = await dbClient.query(query, values);
        return result.rows[0] || null;
    }

    static async findAll(): Promise<Client[]> {
        const dbClient = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} ORDER BY created_at DESC`;
        const result = await dbClient.query(query);
        return result.rows;
    }

    static async delete(id: string): Promise<boolean> {
        const dbClient = PostgresDatabase.getClient();
        const query = `DELETE FROM ${this.TABLE_NAME} WHERE id = $1`;
        const result = await dbClient.query(query, [id]);
        return (result.rowCount ?? 0) > 0;
    }
}


