import { PostgresDatabase } from '../../database';
import { v4 as uuidv4 } from 'uuid';

export interface Contract {
    id?: string;
    property_id?: string;
    client_id?: string;
    contract_url: string;
    description?: string;
    created_at?: Date;
}

export interface CreateContractDto {
    property_id?: string;
    client_id?: string;
    contract_url: string;
    description?: string;
}

export class ContractModel {
    private static readonly TABLE_NAME = 'contracts';

    static async create(contractData: CreateContractDto): Promise<Contract> {
        const client = PostgresDatabase.getClient();
        
        const id = uuidv4();
        const query = `
            INSERT INTO ${this.TABLE_NAME} (id, property_id, client_id, contract_url, description, created_at)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        
        const values = [
            id,
            contractData.property_id || null,
            contractData.client_id || null,
            contractData.contract_url,
            contractData.description || null,
            new Date()
        ];

        const result = await client.query(query, values);
        return result.rows[0];
    }

    static async findById(id: string): Promise<Contract | null> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE id = $1`;
        const result = await client.query(query, [id]);
        return result.rows[0] || null;
    }

    static async findByProperty(propertyId: string): Promise<Contract[]> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE property_id = $1 ORDER BY created_at DESC`;
        const result = await client.query(query, [propertyId]);
        return result.rows;
    }

    static async findByClient(clientId: string): Promise<Contract[]> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE client_id = $1 ORDER BY created_at DESC`;
        const result = await client.query(query, [clientId]);
        return result.rows;
    }

    static async findAll(): Promise<Contract[]> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} ORDER BY created_at DESC`;
        const result = await client.query(query);
        return result.rows;
    }

    static async update(id: string, updateData: Partial<CreateContractDto>): Promise<Contract | null> {
        const client = PostgresDatabase.getClient();
        
        const fields: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        if (updateData.property_id !== undefined) {
            fields.push(`property_id = $${paramIndex++}`);
            values.push(updateData.property_id || null);
        }
        if (updateData.client_id !== undefined) {
            fields.push(`client_id = $${paramIndex++}`);
            values.push(updateData.client_id || null);
        }
        if (updateData.contract_url) {
            fields.push(`contract_url = $${paramIndex++}`);
            values.push(updateData.contract_url);
        }
        if (updateData.description !== undefined) {
            fields.push(`description = $${paramIndex++}`);
            values.push(updateData.description || null);
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


