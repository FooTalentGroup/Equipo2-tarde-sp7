import { PostgresDatabase } from '../../database';

export interface Address {
    id?: number;
    street: string;
    number?: string;
    full_address: string;
    neighborhood?: string;
    postal_code?: string;
    latitude?: number;
    longitude?: number;
    city_id: number;
}

export interface CreateAddressDto {
    street: string;
    number?: string;
    full_address: string;
    neighborhood?: string;
    postal_code?: string;
    latitude?: number;
    longitude?: number;
    city_id: number;
}

export class AddressModel {
    private static readonly TABLE_NAME = 'addresses';

    static async create(addressData: CreateAddressDto): Promise<Address> {
        const client = PostgresDatabase.getClient();
        
        const query = `
            INSERT INTO ${this.TABLE_NAME} (
                street, number, full_address, neighborhood, postal_code, latitude, longitude, city_id
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `;
        
        const values = [
            addressData.street,
            addressData.number || null,
            addressData.full_address,
            addressData.neighborhood || null,
            addressData.postal_code || null,
            addressData.latitude || null,
            addressData.longitude || null,
            addressData.city_id,
        ];

        const result = await client.query(query, values);
        return result.rows[0];
    }

    static async findById(id: number): Promise<Address | null> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE id = $1`;
        const result = await client.query(query, [id]);
        return result.rows[0] || null;
    }

    static async findByCityId(cityId: number): Promise<Address[]> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE city_id = $1 ORDER BY full_address`;
        const result = await client.query(query, [cityId]);
        return result.rows;
    }

    static async findByStreetAndNumber(
        cityId: number,
        street: string,
        number?: string
    ): Promise<Address[]> {
        const client = PostgresDatabase.getClient();
        let query = `SELECT * FROM ${this.TABLE_NAME} WHERE city_id = $1`;
        const values: any[] = [cityId];
        let paramIndex = 2;

        if (street) {
            query += ` AND LOWER(TRIM(street)) = LOWER(TRIM($${paramIndex++}))`;
            values.push(street);
        }

        if (number) {
            query += ` AND TRIM(number) = TRIM($${paramIndex++})`;
            values.push(number);
        } else {
            query += ` AND (number IS NULL OR number = '')`;
        }

        const result = await client.query(query, values);
        return result.rows;
    }

    static async findByCoordinates(latitude: number, longitude: number, radiusKm: number = 1): Promise<Address[]> {
        const client = PostgresDatabase.getClient();
        // Simple distance calculation (Haversine formula would be better with PostGIS)
        const query = `
            SELECT *, 
                (6371 * acos(
                    cos(radians($1)) * cos(radians(latitude)) *
                    cos(radians(longitude) - radians($2)) +
                    sin(radians($1)) * sin(radians(latitude))
                )) AS distance
            FROM ${this.TABLE_NAME}
            WHERE latitude IS NOT NULL AND longitude IS NOT NULL
            HAVING distance < $3
            ORDER BY distance
        `;
        const result = await client.query(query, [latitude, longitude, radiusKm]);
        return result.rows;
    }

    static async update(id: number, updateData: Partial<CreateAddressDto>): Promise<Address | null> {
        const client = PostgresDatabase.getClient();
        
        const fields: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        if (updateData.street !== undefined) {
            fields.push(`street = $${paramIndex++}`);
            values.push(updateData.street);
        }
        if (updateData.number !== undefined) {
            fields.push(`number = $${paramIndex++}`);
            values.push(updateData.number || null);
        }
        if (updateData.full_address !== undefined) {
            fields.push(`full_address = $${paramIndex++}`);
            values.push(updateData.full_address);
        }
        if (updateData.neighborhood !== undefined) {
            fields.push(`neighborhood = $${paramIndex++}`);
            values.push(updateData.neighborhood || null);
        }
        if (updateData.postal_code !== undefined) {
            fields.push(`postal_code = $${paramIndex++}`);
            values.push(updateData.postal_code || null);
        }
        if (updateData.latitude !== undefined) {
            fields.push(`latitude = $${paramIndex++}`);
            values.push(updateData.latitude || null);
        }
        if (updateData.longitude !== undefined) {
            fields.push(`longitude = $${paramIndex++}`);
            values.push(updateData.longitude || null);
        }
        if (updateData.city_id !== undefined) {
            fields.push(`city_id = $${paramIndex++}`);
            values.push(updateData.city_id);
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

