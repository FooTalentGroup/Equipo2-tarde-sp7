import { PostgresDatabase } from '../../database';

export interface PropertyCharacteristic {
    id?: number;
    property_id: number;
    name: string;
    value: string;
}

export interface CreatePropertyCharacteristicDto {
    property_id: number;
    name: string;
    value: string;
}

export class PropertyCharacteristicModel {
    private static readonly TABLE_NAME = 'property_characteristics';

    static async create(characteristicData: CreatePropertyCharacteristicDto): Promise<PropertyCharacteristic> {
        const client = PostgresDatabase.getClient();
        
        const query = `
            INSERT INTO ${this.TABLE_NAME} (property_id, name, value)
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        
        const result = await client.query(query, [
            characteristicData.property_id,
            characteristicData.name,
            characteristicData.value,
        ]);

        return result.rows[0];
    }

    static async findById(id: number): Promise<PropertyCharacteristic | null> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE id = $1`;
        const result = await client.query(query, [id]);
        return result.rows[0] || null;
    }

    static async findByPropertyId(propertyId: number): Promise<PropertyCharacteristic[]> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE property_id = $1 ORDER BY name`;
        const result = await client.query(query, [propertyId]);
        return result.rows;
    }

    static async update(id: number, updateData: Partial<CreatePropertyCharacteristicDto>): Promise<PropertyCharacteristic | null> {
        const client = PostgresDatabase.getClient();
        
        const fields: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        if (updateData.name) {
            fields.push(`name = $${paramIndex++}`);
            values.push(updateData.name);
        }
        if (updateData.value) {
            fields.push(`value = $${paramIndex++}`);
            values.push(updateData.value);
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

    static async deleteByPropertyId(propertyId: number): Promise<number> {
        const client = PostgresDatabase.getClient();
        const query = `DELETE FROM ${this.TABLE_NAME} WHERE property_id = $1`;
        const result = await client.query(query, [propertyId]);
        return result.rowCount ?? 0;
    }
}

