import { PostgresDatabase } from '../../database';
import { v4 as uuidv4 } from 'uuid';

export interface PropertyImage {
    id?: string;
    property_id: string;
    image_url: string;
    is_primary?: boolean;
    created_at?: Date;
}

export interface CreatePropertyImageDto {
    property_id: string;
    image_url: string;
    is_primary?: boolean;
}

export class PropertyImageModel {
    private static readonly TABLE_NAME = 'property_images';

    static async create(imageData: CreatePropertyImageDto): Promise<PropertyImage> {
        const client = PostgresDatabase.getClient();
        
        // Si es la imagen primaria, desmarcar las demás
        if (imageData.is_primary) {
            await this.unsetPrimaryImages(imageData.property_id);
        }
        
        const id = uuidv4();
        const query = `
            INSERT INTO ${this.TABLE_NAME} (id, property_id, image_url, is_primary, created_at)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        
        const values = [
            id,
            imageData.property_id,
            imageData.image_url,
            imageData.is_primary || false,
            new Date()
        ];

        const result = await client.query(query, values);
        return result.rows[0];
    }

    private static async unsetPrimaryImages(propertyId: string): Promise<void> {
        const client = PostgresDatabase.getClient();
        const query = `UPDATE ${this.TABLE_NAME} SET is_primary = false WHERE property_id = $1`;
        await client.query(query, [propertyId]);
    }

    static async findByProperty(propertyId: string): Promise<PropertyImage[]> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE property_id = $1 ORDER BY is_primary DESC, created_at DESC`;
        const result = await client.query(query, [propertyId]);
        return result.rows;
    }

    static async findPrimary(propertyId: string): Promise<PropertyImage | null> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE property_id = $1 AND is_primary = true LIMIT 1`;
        const result = await client.query(query, [propertyId]);
        return result.rows[0] || null;
    }

    static async findById(id: string): Promise<PropertyImage | null> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE id = $1`;
        const result = await client.query(query, [id]);
        return result.rows[0] || null;
    }

    static async setAsPrimary(id: string): Promise<PropertyImage | null> {
        const client = PostgresDatabase.getClient();
        
        // Obtener la imagen para saber a qué propiedad pertenece
        const image = await this.findById(id);
        if (!image) return null;

        // Desmarcar las demás imágenes como primarias
        await this.unsetPrimaryImages(image.property_id);

        // Marcar esta imagen como primaria
        const query = `UPDATE ${this.TABLE_NAME} SET is_primary = true WHERE id = $1 RETURNING *`;
        const result = await client.query(query, [id]);
        return result.rows[0] || null;
    }

    static async delete(id: string): Promise<boolean> {
        const client = PostgresDatabase.getClient();
        const query = `DELETE FROM ${this.TABLE_NAME} WHERE id = $1`;
        const result = await client.query(query, [id]);
        return (result.rowCount ?? 0) > 0;
    }
}


