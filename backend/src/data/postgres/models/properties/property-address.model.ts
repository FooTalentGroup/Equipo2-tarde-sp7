import { PostgresDatabase } from '../../database';

export interface PropertyAddress {
    property_id: number;
    address_id: number;
}

export interface CreatePropertyAddressDto {
    property_id: number;
    address_id: number;
}

export class PropertyAddressModel {
    private static readonly TABLE_NAME = 'property_addresses';

    static async create(data: CreatePropertyAddressDto): Promise<PropertyAddress> {
        const client = PostgresDatabase.getClient();
        
        const query = `
            INSERT INTO ${this.TABLE_NAME} (property_id, address_id)
            VALUES ($1, $2)
            ON CONFLICT (property_id, address_id) DO NOTHING
            RETURNING *
        `;
        
        const result = await client.query(query, [data.property_id, data.address_id]);
        return result.rows[0];
    }

    static async findByPropertyId(propertyId: number): Promise<PropertyAddress[]> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE property_id = $1`;
        const result = await client.query(query, [propertyId]);
        return result.rows;
    }

    static async findByAddressId(addressId: number): Promise<PropertyAddress[]> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE address_id = $1`;
        const result = await client.query(query, [addressId]);
        return result.rows;
    }

    static async delete(propertyId: number, addressId: number): Promise<boolean> {
        const client = PostgresDatabase.getClient();
        const query = `DELETE FROM ${this.TABLE_NAME} WHERE property_id = $1 AND address_id = $2`;
        const result = await client.query(query, [propertyId, addressId]);
        return (result.rowCount ?? 0) > 0;
    }

    static async deleteByPropertyId(propertyId: number): Promise<number> {
        const client = PostgresDatabase.getClient();
        const query = `DELETE FROM ${this.TABLE_NAME} WHERE property_id = $1`;
        const result = await client.query(query, [propertyId]);
        return result.rowCount ?? 0;
    }
}

