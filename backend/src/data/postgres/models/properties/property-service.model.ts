import { PostgresDatabase } from '../../database';

export interface PropertyService {
    id_property: string;
    id_service: string;
}

export class PropertyServiceModel {
    private static readonly TABLE_NAME = 'property_services';

    static async create(propertyId: string, serviceId: string): Promise<PropertyService> {
        const client = PostgresDatabase.getClient();
        const query = `
            INSERT INTO ${this.TABLE_NAME} (id_property, id_service)
            VALUES ($1, $2)
            RETURNING *
        `;
        const result = await client.query(query, [propertyId, serviceId]);
        return result.rows[0];
    }

    static async findByProperty(propertyId: string): Promise<PropertyService[]> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE id_property = $1`;
        const result = await client.query(query, [propertyId]);
        return result.rows;
    }

    static async findByService(serviceId: string): Promise<PropertyService[]> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE id_service = $1`;
        const result = await client.query(query, [serviceId]);
        return result.rows;
    }

    static async findOne(propertyId: string, serviceId: string): Promise<PropertyService | null> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE id_property = $1 AND id_service = $2`;
        const result = await client.query(query, [propertyId, serviceId]);
        return result.rows[0] || null;
    }

    static async delete(propertyId: string, serviceId: string): Promise<boolean> {
        const client = PostgresDatabase.getClient();
        const query = `DELETE FROM ${this.TABLE_NAME} WHERE id_property = $1 AND id_service = $2`;
        const result = await client.query(query, [propertyId, serviceId]);
        return (result.rowCount ?? 0) > 0;
    }

    static async deleteByProperty(propertyId: string): Promise<boolean> {
        const client = PostgresDatabase.getClient();
        const query = `DELETE FROM ${this.TABLE_NAME} WHERE id_property = $1`;
        const result = await client.query(query, [propertyId]);
        return (result.rowCount ?? 0) > 0;
    }
}

