import { PostgresDatabase } from '../../database';

export interface Profile {
    id?: number;
    first_name: string;
    last_name: string;
    email: string;
    password_hash: string;
    phone?: string;
    active?: boolean;
    deleted?: boolean;
    created_at?: Date;
    role_id: number;
}

export interface CreateProfileDto {
    first_name: string;
    last_name: string;
    email: string;
    password_hash: string;
    phone?: string;
    role_id: number;
    active?: boolean;
}

export class ProfileModel {
    private static readonly TABLE_NAME = 'users';

    static async create(profileData: CreateProfileDto): Promise<Profile> {
        const client = PostgresDatabase.getClient();
        
        // La tabla users usa password_hash y tiene active
        const query = `
            INSERT INTO ${this.TABLE_NAME} (first_name, last_name, email, password_hash, phone, role_id, active)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `;
        
        const values = [
            profileData.first_name,
            profileData.last_name,
            profileData.email,
            profileData.password_hash,
            profileData.phone || null,
            profileData.role_id,
            profileData.active !== undefined ? profileData.active : true
        ];

        const result = await client.query(query, values);
        const row = result.rows[0];
        
        // Mapear password_hash correctamente
        return {
            ...row,
            password_hash: row.password_hash
        };
    }

    static async findByEmail(email: string): Promise<Profile | null> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE email = $1 AND deleted = false`;
        const result = await client.query(query, [email]);
        const row = result.rows[0];
        if (!row) return null;
        
        return {
            ...row,
            password_hash: row.password_hash
        };
    }

    static async findById(id: number | string): Promise<Profile | null> {
        const client = PostgresDatabase.getClient();
        // La tabla users usa SERIAL (números)
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE id = $1 AND deleted = false`;
        const result = await client.query(query, [id]);
        const row = result.rows[0];
        if (!row) return null;
        
        return {
            ...row,
            password_hash: row.password_hash
        };
    }

    static async update(id: number | string, updateData: Partial<CreateProfileDto>): Promise<Profile | null> {
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
        if (updateData.email) {
            fields.push(`email = $${paramIndex++}`);
            values.push(updateData.email);
        }
        if (updateData.password_hash) {
            fields.push(`password_hash = $${paramIndex++}`);
            values.push(updateData.password_hash);
        }
        if (updateData.phone !== undefined) {
            fields.push(`phone = $${paramIndex++}`);
            values.push(updateData.phone || null);
        }
        if (updateData.role_id !== undefined) {
            fields.push(`role_id = $${paramIndex++}`);
            values.push(updateData.role_id);
        }
        if (updateData.active !== undefined) {
            fields.push(`active = $${paramIndex++}`);
            values.push(updateData.active);
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
        const row = result.rows[0];
        if (!row) return null;
        
        return {
            ...row,
            password_hash: row.password_hash
        };
    }

    static async findAll(): Promise<Profile[]> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE deleted = false ORDER BY created_at DESC`;
        const result = await client.query(query);
        return result.rows.map(row => ({
            ...row,
            password_hash: row.password_hash
        }));
    }

    /**
     * Soft delete: marca el usuario como eliminado (deleted = true)
     */
    static async delete(id: number): Promise<boolean> {
        const client = PostgresDatabase.getClient();
        const query = `UPDATE ${this.TABLE_NAME} SET deleted = true WHERE id = $1`;
        const result = await client.query(query, [id]);
        return (result.rowCount ?? 0) > 0;
    }

    /**
     * Restaura un usuario eliminado lógicamente (soft delete)
     */
    static async restore(id: number): Promise<boolean> {
        const client = PostgresDatabase.getClient();
        const query = `UPDATE ${this.TABLE_NAME} SET deleted = false WHERE id = $1`;
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

    // Métodos de compatibilidad para código existente
    static async findByEmailWithPassword(email: string): Promise<Profile | null> {
        const client = PostgresDatabase.getClient();
        const query = `SELECT * FROM ${this.TABLE_NAME} WHERE email = $1 AND deleted = false`;
        const result = await client.query(query, [email]);
        const row = result.rows[0];
        if (!row) return null;
        
        return {
            ...row,
            password_hash: row.password_hash
        };
    }
}

