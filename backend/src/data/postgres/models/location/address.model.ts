import { PostgresDatabase } from '../../database';
import { v4 as uuidv4 } from 'uuid';

export interface Address {
    id?: string;
    street: string;
    number?: string;
    id_department: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface CreateAddressDto {
    street: string;
    number?: string;
    id_department: string;
}

export class AddressModel {
    private static readonly TABLE_NAME = 'addresses';

    static async create(addressData: CreateAddressDto): Promise<Address> {
        const client = PostgresDatabase.getClient();
        
        const id = uuidv4();
        const query = `
            INSERT INTO ${this.TABLE_NAME} (id, street, number, id_department, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        
        const values = [
            id,
            addressData.street,
            addressData.number || null,
            addressData.id_department,
            new Date(),
            new Date()
        ];

        const result = await client.query(query, values);
        return result.rows[0];
    }

    static async findById(id: string): Promise<Address | null> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE id = $1`;
        const result = await client.query(query, [id]);
        return result.rows[0] || null;
    }

    static async findByDepartment(departmentId: string): Promise<Address[]> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE id_department = $1 ORDER BY created_at DESC`;
        const result = await client.query(query, [departmentId]);
        return result.rows;
    }

    static async findAll(): Promise<Address[]> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} ORDER BY created_at DESC`;
        const result = await client.query(query);
        return result.rows;
    }

    static async update(id: string, updateData: Partial<CreateAddressDto>): Promise<Address | null> {
        const client = PostgresDatabase.getClient();
        
        const fields: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        if (updateData.street) {
            fields.push(`street = $${paramIndex++}`);
            values.push(updateData.street);
        }
        if (updateData.number !== undefined) {
            fields.push(`number = $${paramIndex++}`);
            values.push(updateData.number || null);
        }
        if (updateData.id_department) {
            fields.push(`id_department = $${paramIndex++}`);
            values.push(updateData.id_department);
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


