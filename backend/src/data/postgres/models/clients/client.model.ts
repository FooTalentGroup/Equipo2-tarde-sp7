import { PostgresDatabase } from '../../database';

export interface Client {
    id?: number;
    first_name: string;
    last_name: string;
    email?: string;
    dni?: string;
    phone: string;
    property_interest_phone?: string;
    address?: string;
    notes?: string;
    registered_at?: Date;
    deleted?: boolean;
    contact_category_id: number;
    interest_zone?: string;
    purchase_interest?: boolean;
    rental_interest?: boolean;
    property_search_type_id?: number;
    city_id?: number;
}

export interface CreateClientDto {
    first_name: string;
    last_name: string;
    email?: string;
    dni?: string;
    phone: string;
    property_interest_phone?: string;
    address?: string;
    notes?: string;
    contact_category_id: number;
    interest_zone?: string;
    purchase_interest?: boolean;
    rental_interest?: boolean;
    property_search_type_id?: number;
    city_id?: number;
}

export class ClientModel {
    private static readonly TABLE_NAME = 'clients';

    static async create(clientData: CreateClientDto): Promise<Client> {
        const client = PostgresDatabase.getClient();
        
        const query = `
            INSERT INTO ${this.TABLE_NAME} (
                first_name, last_name, email, dni, phone, property_interest_phone,
                address, notes, contact_category_id, interest_zone,
                purchase_interest, rental_interest, property_search_type_id, city_id,
                registered_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, CURRENT_TIMESTAMP)
            RETURNING *
        `;
        
        const values = [
            clientData.first_name,
            clientData.last_name,
            clientData.email || null,
            clientData.dni || null,
            clientData.phone,
            clientData.property_interest_phone || null,
            clientData.address || null,
            clientData.notes || null,
            clientData.contact_category_id,
            clientData.interest_zone || null,
            clientData.purchase_interest !== undefined ? clientData.purchase_interest : false,
            clientData.rental_interest !== undefined ? clientData.rental_interest : false,
            clientData.property_search_type_id || null,
            clientData.city_id || null,
        ];

        const result = await client.query(query, values);
        return result.rows[0];
    }

    static async findById(id: number): Promise<Client | null> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE id = $1 AND deleted = false`;
        const result = await client.query(query, [id]);
        return result.rows[0] || null;
    }

    static async findByEmail(email: string): Promise<Client | null> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE email = $1 AND deleted = false`;
        const result = await client.query(query, [email]);
        return result.rows[0] || null;
    }

    static async findByDni(dni: string): Promise<Client | null> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE dni = $1 AND deleted = false`;
        const result = await client.query(query, [dni]);
        return result.rows[0] || null;
    }

    static async findByPhone(phone: string): Promise<Client[]> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE phone = $1 AND deleted = false`;
        const result = await client.query(query, [phone]);
        return result.rows;
    }

    static async findAll(filters?: {
        contact_category_id?: number;
        purchase_interest?: boolean;
        rental_interest?: boolean;
        city_id?: number;
        limit?: number;
        offset?: number;
    }): Promise<Client[]> {
        const dbClient = PostgresDatabase.getClient();
        let query = `SELECT * FROM ${this.TABLE_NAME} WHERE deleted = false`;
        const values: any[] = [];
        let paramIndex = 1;

        if (filters) {
            if (filters.contact_category_id !== undefined) {
                query += ` AND contact_category_id = $${paramIndex++}`;
                values.push(filters.contact_category_id);
            }
            if (filters.purchase_interest !== undefined) {
                query += ` AND purchase_interest = $${paramIndex++}`;
                values.push(filters.purchase_interest);
            }
            if (filters.rental_interest !== undefined) {
                query += ` AND rental_interest = $${paramIndex++}`;
                values.push(filters.rental_interest);
            }
            if (filters.city_id !== undefined) {
                query += ` AND city_id = $${paramIndex++}`;
                values.push(filters.city_id);
            }
        }

        query += ` ORDER BY registered_at DESC`;

        if (filters?.limit) {
            query += ` LIMIT $${paramIndex++}`;
            values.push(filters.limit);
            if (filters.offset) {
                query += ` OFFSET $${paramIndex++}`;
                values.push(filters.offset);
            }
        }

        const result = await dbClient.query(query, values);
        return result.rows;
    }

    static async update(id: number, updateData: Partial<CreateClientDto>): Promise<Client | null> {
        const client = PostgresDatabase.getClient();
        
        const fields: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        if (updateData.first_name) {
            fields.push(`first_name = $${paramIndex++}`);
            values.push(updateData.first_name);
        }
        if (updateData.last_name) {
            fields.push(`last_name = $${paramIndex++}`);
            values.push(updateData.last_name);
        }
        if (updateData.email !== undefined) {
            fields.push(`email = $${paramIndex++}`);
            values.push(updateData.email || null);
        }
        if (updateData.dni !== undefined) {
            fields.push(`dni = $${paramIndex++}`);
            values.push(updateData.dni || null);
        }
        if (updateData.phone) {
            fields.push(`phone = $${paramIndex++}`);
            values.push(updateData.phone);
        }
        if (updateData.property_interest_phone !== undefined) {
            fields.push(`property_interest_phone = $${paramIndex++}`);
            values.push(updateData.property_interest_phone || null);
        }
        if (updateData.address !== undefined) {
            fields.push(`address = $${paramIndex++}`);
            values.push(updateData.address || null);
        }
        if (updateData.notes !== undefined) {
            fields.push(`notes = $${paramIndex++}`);
            values.push(updateData.notes || null);
        }
        if (updateData.contact_category_id !== undefined) {
            fields.push(`contact_category_id = $${paramIndex++}`);
            values.push(updateData.contact_category_id);
        }
        if (updateData.interest_zone !== undefined) {
            fields.push(`interest_zone = $${paramIndex++}`);
            values.push(updateData.interest_zone || null);
        }
        if (updateData.purchase_interest !== undefined) {
            fields.push(`purchase_interest = $${paramIndex++}`);
            values.push(updateData.purchase_interest);
        }
        if (updateData.rental_interest !== undefined) {
            fields.push(`rental_interest = $${paramIndex++}`);
            values.push(updateData.rental_interest);
        }
        if (updateData.property_search_type_id !== undefined) {
            fields.push(`property_search_type_id = $${paramIndex++}`);
            values.push(updateData.property_search_type_id || null);
        }
        if (updateData.city_id !== undefined) {
            fields.push(`city_id = $${paramIndex++}`);
            values.push(updateData.city_id || null);
        }

        if (fields.length === 0) {
            return await this.findById(id);
        }

        values.push(id);

        const query = `
            UPDATE ${this.TABLE_NAME}
            SET ${fields.join(', ')}
            WHERE id = $${paramIndex} AND deleted = false
            RETURNING *
        `;

        const result = await client.query(query, values);
        return result.rows[0] || null;
    }

    /**
     * Soft delete: marca el cliente como eliminado (deleted = true)
     * El registro permanece en la base de datos pero no aparece en búsquedas normales
     */
    static async delete(id: number): Promise<boolean> {
        const client = PostgresDatabase.getClient();
        const query = `UPDATE ${this.TABLE_NAME} SET deleted = true WHERE id = $1 AND deleted = false RETURNING id`;
        const result = await client.query(query, [id]);
        return (result.rowCount ?? 0) > 0;
    }

    /**
     * Restaura un cliente eliminado lógicamente (soft delete)
     */
    static async restore(id: number): Promise<boolean> {
        const client = PostgresDatabase.getClient();
        const query = `UPDATE ${this.TABLE_NAME} SET deleted = false WHERE id = $1 AND deleted = true RETURNING id`;
        const result = await client.query(query, [id]);
        return (result.rowCount ?? 0) > 0;
    }

    /**
     * Hard delete: elimina físicamente el registro de la base de datos
     * ⚠️ Use con precaución: esta acción no se puede deshacer
     */
    static async hardDelete(id: number): Promise<boolean> {
        const client = PostgresDatabase.getClient();
        const query = `DELETE FROM ${this.TABLE_NAME} WHERE id = $1`;
        const result = await client.query(query, [id]);
        return (result.rowCount ?? 0) > 0;
    }
}

