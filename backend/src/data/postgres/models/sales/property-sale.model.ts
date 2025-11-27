import { PostgresDatabase } from '../../database';

export interface PropertySale {
    id?: number;
    property_id: number;
    buyer_client_id: number;
    sale_date: Date;
    final_amount: number;
    currency_type_id: number;
    seller_user_id: number;
}

export interface CreatePropertySaleDto {
    property_id: number;
    buyer_client_id: number;
    sale_date: Date;
    final_amount: number;
    currency_type_id: number;
    seller_user_id: number;
}

export interface PropertySaleFilters {
    property_id?: number;
    buyer_client_id?: number;
    seller_user_id?: number;
    start_date?: Date;
    end_date?: Date;
    limit?: number;
    offset?: number;
}

export class PropertySaleModel {
    private static readonly TABLE_NAME = 'property_sales';

    static async create(saleData: CreatePropertySaleDto): Promise<PropertySale> {
        const client = PostgresDatabase.getClient();
        
        const query = `
            INSERT INTO ${this.TABLE_NAME} (
                property_id, buyer_client_id, sale_date, final_amount, currency_type_id, seller_user_id
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        
        const result = await client.query(query, [
            saleData.property_id,
            saleData.buyer_client_id,
            saleData.sale_date,
            saleData.final_amount,
            saleData.currency_type_id,
            saleData.seller_user_id,
        ]);

        return result.rows[0];
    }

    static async findById(id: number): Promise<PropertySale | null> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE id = $1`;
        const result = await client.query(query, [id]);
        return result.rows[0] || null;
    }

    static async findByPropertyId(propertyId: number): Promise<PropertySale | null> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE property_id = $1 ORDER BY sale_date DESC LIMIT 1`;
        const result = await client.query(query, [propertyId]);
        return result.rows[0] || null;
    }

    static async findAll(filters?: PropertySaleFilters): Promise<PropertySale[]> {
        const client = PostgresDatabase.getClient();
        let query = `SELECT * FROM ${this.TABLE_NAME}`;
        const conditions: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        if (filters) {
            if (filters.property_id !== undefined) {
                conditions.push(`property_id = $${paramIndex++}`);
                values.push(filters.property_id);
            }
            if (filters.buyer_client_id !== undefined) {
                conditions.push(`buyer_client_id = $${paramIndex++}`);
                values.push(filters.buyer_client_id);
            }
            if (filters.seller_user_id !== undefined) {
                conditions.push(`seller_user_id = $${paramIndex++}`);
                values.push(filters.seller_user_id);
            }
            if (filters.start_date) {
                conditions.push(`sale_date >= $${paramIndex++}`);
                values.push(filters.start_date);
            }
            if (filters.end_date) {
                conditions.push(`sale_date <= $${paramIndex++}`);
                values.push(filters.end_date);
            }
        }

        if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(' AND ')}`;
        }

        query += ` ORDER BY sale_date DESC`;

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

    static async update(id: number, updateData: Partial<CreatePropertySaleDto>): Promise<PropertySale | null> {
        const client = PostgresDatabase.getClient();
        
        const fields: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        if (updateData.sale_date) {
            fields.push(`sale_date = $${paramIndex++}`);
            values.push(updateData.sale_date);
        }
        if (updateData.final_amount !== undefined) {
            fields.push(`final_amount = $${paramIndex++}`);
            values.push(updateData.final_amount);
        }
        if (updateData.currency_type_id !== undefined) {
            fields.push(`currency_type_id = $${paramIndex++}`);
            values.push(updateData.currency_type_id);
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

