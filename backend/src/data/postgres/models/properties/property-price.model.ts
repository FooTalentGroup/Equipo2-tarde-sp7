import { PostgresDatabase } from '../../database';

export interface PropertyPrice {
    id?: number;
    property_id: number;
    price: number;
    currency_type_id: number;
    operation_type_id: number;
    updated_at?: Date;
}

export interface CreatePropertyPriceDto {
    property_id: number;
    price: number;
    currency_type_id: number;
    operation_type_id: number;
}

export class PropertyPriceModel {
    private static readonly TABLE_NAME = 'property_prices';

    static async create(priceData: CreatePropertyPriceDto): Promise<PropertyPrice> {
        const client = PostgresDatabase.getClient();
        
        const query = `
            INSERT INTO ${this.TABLE_NAME} (property_id, price, currency_type_id, operation_type_id, updated_at)
            VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
            RETURNING *
        `;
        
        const result = await client.query(query, [
            priceData.property_id,
            priceData.price,
            priceData.currency_type_id,
            priceData.operation_type_id,
        ]);

        return result.rows[0];
    }

    static async findById(id: number): Promise<PropertyPrice | null> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE id = $1`;
        const result = await client.query(query, [id]);
        return result.rows[0] || null;
    }

    static async findByPropertyId(propertyId: number): Promise<PropertyPrice[]> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE property_id = $1 ORDER BY updated_at DESC`;
        const result = await client.query(query, [propertyId]);
        return result.rows;
    }

    static async findCurrentByPropertyAndOperation(
        propertyId: number,
        operationTypeId: number
    ): Promise<PropertyPrice | null> {
        const client = PostgresDatabase.getClient();
        const query = `
            SELECT * FROM ${this.TABLE_NAME}
            WHERE property_id = $1 AND operation_type_id = $2
            ORDER BY updated_at DESC
            LIMIT 1
        `;
        const result = await client.query(query, [propertyId, operationTypeId]);
        return result.rows[0] || null;
    }

    static async update(id: number, updateData: Partial<CreatePropertyPriceDto>): Promise<PropertyPrice | null> {
        const client = PostgresDatabase.getClient();
        
        const fields: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        if (updateData.price !== undefined) {
            fields.push(`price = $${paramIndex++}`);
            values.push(updateData.price);
        }
        if (updateData.currency_type_id !== undefined) {
            fields.push(`currency_type_id = $${paramIndex++}`);
            values.push(updateData.currency_type_id);
        }
        if (updateData.operation_type_id !== undefined) {
            fields.push(`operation_type_id = $${paramIndex++}`);
            values.push(updateData.operation_type_id);
        }

        if (fields.length === 0) {
            return await this.findById(id);
        }

        fields.push(`updated_at = CURRENT_TIMESTAMP`);
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

