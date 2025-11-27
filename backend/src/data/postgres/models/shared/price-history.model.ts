import { PostgresDatabase } from '../../database';

export interface PriceHistory {
    id?: number;
    property_id: number;
    previous_price?: number;
    new_price: number;
    currency_type_id: number;
    operation_type_id: number;
    changed_at?: Date;
    responsible_user_id: number;
}

export interface CreatePriceHistoryDto {
    property_id: number;
    previous_price?: number;
    new_price: number;
    currency_type_id: number;
    operation_type_id: number;
    responsible_user_id: number;
}

export class PriceHistoryModel {
    private static readonly TABLE_NAME = 'price_history';

    static async create(historyData: CreatePriceHistoryDto): Promise<PriceHistory> {
        const client = PostgresDatabase.getClient();
        
        const query = `
            INSERT INTO ${this.TABLE_NAME} (
                property_id, previous_price, new_price, currency_type_id,
                operation_type_id, responsible_user_id, changed_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
            RETURNING *
        `;
        
        const result = await client.query(query, [
            historyData.property_id,
            historyData.previous_price || null,
            historyData.new_price,
            historyData.currency_type_id,
            historyData.operation_type_id,
            historyData.responsible_user_id,
        ]);

        return result.rows[0];
    }

    static async findById(id: number): Promise<PriceHistory | null> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE id = $1`;
        const result = await client.query(query, [id]);
        return result.rows[0] || null;
    }

    static async findByPropertyId(propertyId: number): Promise<PriceHistory[]> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE property_id = $1 ORDER BY changed_at DESC`;
        const result = await client.query(query, [propertyId]);
        return result.rows;
    }

    static async findByPropertyAndOperation(
        propertyId: number,
        operationTypeId: number
    ): Promise<PriceHistory[]> {
        const client = PostgresDatabase.getClient();
        const query = `
            SELECT * FROM ${this.TABLE_NAME}
            WHERE property_id = $1 AND operation_type_id = $2
            ORDER BY changed_at DESC
        `;
        const result = await client.query(query, [propertyId, operationTypeId]);
        return result.rows;
    }

    static async delete(id: number): Promise<boolean> {
        const client = PostgresDatabase.getClient();
        const query = `DELETE FROM ${this.TABLE_NAME} WHERE id = $1`;
        const result = await client.query(query, [id]);
        return (result.rowCount ?? 0) > 0;
    }
}

