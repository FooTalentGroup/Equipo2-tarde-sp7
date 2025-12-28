import { PostgresDatabase } from '../../database';

export interface PropertyDocument {
    id?: number;
    property_id: number;
    client_id?: number;
    document_name: string;
    file_path: string;
    uploaded_at?: Date;
}

export interface CreatePropertyDocumentDto {
    property_id: number;
    client_id?: number;
    document_name: string;
    file_path: string;
}

export class PropertyDocumentModel {
    private static readonly TABLE_NAME = 'property_documents';

    static async create(documentData: CreatePropertyDocumentDto): Promise<PropertyDocument> {
        const client = PostgresDatabase.getClient();
        
        const query = `
            INSERT INTO ${this.TABLE_NAME} (property_id, client_id, document_name, file_path, uploaded_at)
            VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
            RETURNING *
        `;
        
        const result = await client.query(query, [
            documentData.property_id,
            documentData.client_id || null,
            documentData.document_name,
            documentData.file_path,
        ]);

        return result.rows[0];
    }

    static async findById(id: number): Promise<PropertyDocument | null> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE id = $1`;
        const result = await client.query(query, [id]);
        return result.rows[0] || null;
    }

    static async findByPropertyId(propertyId: number): Promise<PropertyDocument[]> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE property_id = $1 ORDER BY uploaded_at DESC`;
        const result = await client.query(query, [propertyId]);
        return result.rows;
    }

    static async findByClientId(clientId: number): Promise<PropertyDocument[]> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE client_id = $1 ORDER BY uploaded_at DESC`;
        const result = await client.query(query, [clientId]);
        return result.rows;
    }

    static async delete(id: number): Promise<boolean> {
        const client = PostgresDatabase.getClient();
        const query = `DELETE FROM ${this.TABLE_NAME} WHERE id = $1`;
        const result = await client.query(query, [id]);
        return (result.rowCount ?? 0) > 0;
    }
}

