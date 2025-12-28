import { PostgresDatabase } from '../../database';

export interface PropertyService {
    property_id: number;
    service_id: number;
}

export interface CreatePropertyServiceDto {
    property_id: number;
    service_id: number;
}

export class PropertyServiceModel {
    private static readonly TABLE_NAME = 'property_services';

    static async create(data: CreatePropertyServiceDto): Promise<PropertyService> {
        const client = PostgresDatabase.getClient();
        
        const query = `
            INSERT INTO ${this.TABLE_NAME} (property_id, service_id)
            VALUES ($1, $2)
            ON CONFLICT (property_id, service_id) DO NOTHING
            RETURNING *
        `;
        
        const result = await client.query(query, [data.property_id, data.service_id]);
        return result.rows[0];
    }

    static async findByPropertyId(propertyId: number): Promise<PropertyService[]> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE property_id = $1`;
        const result = await client.query(query, [propertyId]);
        return result.rows;
    }

    static async findByServiceId(serviceId: number): Promise<PropertyService[]> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE service_id = $1`;
        const result = await client.query(query, [serviceId]);
        return result.rows;
    }

    static async delete(propertyId: number, serviceId: number): Promise<boolean> {
        const client = PostgresDatabase.getClient();
        const query = `DELETE FROM ${this.TABLE_NAME} WHERE property_id = $1 AND service_id = $2`;
        const result = await client.query(query, [propertyId, serviceId]);
        return (result.rowCount ?? 0) > 0;
    }

    static async deleteByPropertyId(propertyId: number): Promise<number> {
        const client = PostgresDatabase.getClient();
        const query = `DELETE FROM ${this.TABLE_NAME} WHERE property_id = $1`;
        const result = await client.query(query, [propertyId]);
        return result.rowCount ?? 0;
    }
}

