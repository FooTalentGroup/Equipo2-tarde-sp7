import { PostgresDatabase } from '../../database';

export interface PropertyMultimedia {
    id?: number;
    property_id: number;
    file_path: string;
    media_type: string;
    is_primary?: boolean;
}

export interface CreatePropertyMultimediaDto {
    property_id: number;
    file_path: string;
    media_type: string;
    is_primary?: boolean;
}

export class PropertyMultimediaModel {
    private static readonly TABLE_NAME = 'property_multimedia';

    static async create(multimediaData: CreatePropertyMultimediaDto): Promise<PropertyMultimedia> {
        const client = PostgresDatabase.getClient();
        
        const query = `
            INSERT INTO ${this.TABLE_NAME} (property_id, file_path, media_type, is_primary)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        
        const result = await client.query(query, [
            multimediaData.property_id,
            multimediaData.file_path,
            multimediaData.media_type,
            multimediaData.is_primary !== undefined ? multimediaData.is_primary : false,
        ]);

        return result.rows[0];
    }

    static async findById(id: number): Promise<PropertyMultimedia | null> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE id = $1`;
        const result = await client.query(query, [id]);
        return result.rows[0] || null;
    }

    static async findByPropertyId(propertyId: number): Promise<PropertyMultimedia[]> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE property_id = $1 ORDER BY is_primary DESC, id`;
        const result = await client.query(query, [propertyId]);
        return result.rows;
    }

    static async findPrimaryByPropertyId(propertyId: number): Promise<PropertyMultimedia | null> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE property_id = $1 AND is_primary = true LIMIT 1`;
        const result = await client.query(query, [propertyId]);
        return result.rows[0] || null;
    }

    static async setAsPrimary(id: number, propertyId: number): Promise<boolean> {
        const client = PostgresDatabase.getClient();
        
        // Primero quitar primary de todos los demás
        await client.query(
            `UPDATE ${this.TABLE_NAME} SET is_primary = false WHERE property_id = $1`,
            [propertyId]
        );
        
        // Luego establecer este como primary
        const result = await client.query(
            `UPDATE ${this.TABLE_NAME} SET is_primary = true WHERE id = $1 RETURNING id`,
            [id]
        );
        
        return (result.rowCount ?? 0) > 0;
    }

    /**
     * Clears the primary flag for all images of a property
     */
    static async clearPrimaryForProperty(propertyId: number): Promise<void> {
        const client = PostgresDatabase.getClient();
        await client.query(
            `UPDATE ${this.TABLE_NAME} SET is_primary = false WHERE property_id = $1`,
            [propertyId]
        );
    }

    /**
     * Updates the order of images by updating is_primary flag
     * The first image in the array will be set as primary
     */
    static async updateImageOrder(propertyId: number, imageIds: number[]): Promise<boolean> {
        const client = PostgresDatabase.getClient();
        
        try {
            // Clear all primary flags
            await this.clearPrimaryForProperty(propertyId);
            
            // Set the first image as primary if array is not empty
            if (imageIds.length > 0) {
                const result = await client.query(
                    `UPDATE ${this.TABLE_NAME} SET is_primary = true WHERE id = $1 AND property_id = $2 RETURNING id`,
                    [imageIds[0], propertyId]
                );
                return (result.rowCount ?? 0) > 0;
            }
            
            return true;
        } catch (error) {
            console.error('Error updating image order:', error);
            return false;
        }
    }

    static async delete(id: number): Promise<boolean> {
        const client = PostgresDatabase.getClient();
        const query = `DELETE FROM ${this.TABLE_NAME} WHERE id = $1`;
        const result = await client.query(query, [id]);
        return (result.rowCount ?? 0) > 0;
    }
}

