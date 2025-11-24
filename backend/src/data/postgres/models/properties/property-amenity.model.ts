import { PostgresDatabase } from '../../database';

export interface PropertyAmenity {
    property_id: string;
    amenity_id: string;
}

export class PropertyAmenityModel {
    private static readonly TABLE_NAME = 'property_amenities';

    static async create(propertyId: string, amenityId: string): Promise<PropertyAmenity> {
        const client = PostgresDatabase.getClient();
        const query = `
            INSERT INTO ${this.TABLE_NAME} (property_id, amenity_id)
            VALUES ($1, $2)
            RETURNING *
        `;
        const result = await client.query(query, [propertyId, amenityId]);
        return result.rows[0];
    }

    static async findByProperty(propertyId: string): Promise<PropertyAmenity[]> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE property_id = $1`;
        const result = await client.query(query, [propertyId]);
        return result.rows;
    }

    static async findByAmenity(amenityId: string): Promise<PropertyAmenity[]> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE amenity_id = $1`;
        const result = await client.query(query, [amenityId]);
        return result.rows;
    }

    static async findOne(propertyId: string, amenityId: string): Promise<PropertyAmenity | null> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE property_id = $1 AND amenity_id = $2`;
        const result = await client.query(query, [propertyId, amenityId]);
        return result.rows[0] || null;
    }

    static async delete(propertyId: string, amenityId: string): Promise<boolean> {
        const client = PostgresDatabase.getClient();
        const query = `DELETE FROM ${this.TABLE_NAME} WHERE property_id = $1 AND amenity_id = $2`;
        const result = await client.query(query, [propertyId, amenityId]);
        return (result.rowCount ?? 0) > 0;
    }

    static async deleteByProperty(propertyId: string): Promise<boolean> {
        const client = PostgresDatabase.getClient();
        const query = `DELETE FROM ${this.TABLE_NAME} WHERE property_id = $1`;
        const result = await client.query(query, [propertyId]);
        return (result.rowCount ?? 0) > 0;
    }
}

