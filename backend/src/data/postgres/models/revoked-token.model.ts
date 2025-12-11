import { PostgresDatabase } from '../postgres-database';

export interface RevokedToken {
    id: number;
    token_jti: string;
    user_id: number;
    revoked_at: Date;
    expires_at: Date;
    reason?: string;
    ip_address?: string;
    user_agent?: string;
}

export interface CreateRevokedTokenDto {
    token_jti: string;
    user_id: number;
    expires_at: Date;
    reason?: string;
    ip_address?: string;
    user_agent?: string;
}

export class RevokedTokenModel {
    private static readonly TABLE_NAME = 'revoked_tokens';

    /**
     * Revocar un token (agregarlo a la blacklist)
     */
    static async create(data: CreateRevokedTokenDto): Promise<RevokedToken> {
        const client = PostgresDatabase.getClient();
        
        const query = `
            INSERT INTO ${this.TABLE_NAME} 
            (token_jti, user_id, expires_at, reason, ip_address, user_agent)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        
        const result = await client.query(query, [
            data.token_jti,
            data.user_id,
            data.expires_at,
            data.reason || 'logout',
            data.ip_address || null,
            data.user_agent || null
        ]);
        
        return result.rows[0];
    }

    /**
     * Verificar si un token está revocado
     */
    static async isRevoked(jti: string): Promise<boolean> {
        const client = PostgresDatabase.getClient();
        
        const query = `
            SELECT 1 FROM ${this.TABLE_NAME} 
            WHERE token_jti = $1 
            AND expires_at > NOW()
            LIMIT 1
        `;
        
        const result = await client.query(query, [jti]);
        return result.rows.length > 0;
    }

    /**
     * Revocar todos los tokens de un usuario
     * Útil para "cerrar todas las sesiones"
     */
    static async revokeAllUserTokens(
        userId: number, 
        reason: string = 'security'
    ): Promise<number> {
        const client = PostgresDatabase.getClient();
        
        // Nota: Esto marca que se revocaron todos los tokens del usuario
        // En una implementación completa con tracking de tokens activos,
        // aquí buscarías todos los tokens activos del usuario
        
        const query = `
            INSERT INTO ${this.TABLE_NAME} (token_jti, user_id, expires_at, reason)
            VALUES (
                'revoke_all_' || gen_random_uuid()::text,
                $1,
                NOW() + INTERVAL '24 hours',
                $2
            )
            RETURNING id
        `;
        
        const result = await client.query(query, [userId, reason]);
        return result.rowCount || 0;
    }

    /**
     * Limpiar tokens expirados (para cron job)
     */
    static async cleanExpiredTokens(): Promise<number> {
        const client = PostgresDatabase.getClient();
        
        const query = `
            DELETE FROM ${this.TABLE_NAME} 
            WHERE expires_at < NOW()
        `;
        
        const result = await client.query(query);
        return result.rowCount || 0;
    }

    /**
     * Obtener tokens revocados de un usuario
     */
    static async getUserRevokedTokens(userId: number): Promise<RevokedToken[]> {
        const client = PostgresDatabase.getClient();
        
        const query = `
            SELECT * FROM ${this.TABLE_NAME}
            WHERE user_id = $1
            AND expires_at > NOW()
            ORDER BY revoked_at DESC
        `;
        
        const result = await client.query(query, [userId]);
        return result.rows;
    }

    /**
     * Obtener estadísticas de tokens revocados
     */
    static async getStats(): Promise<{
        total: number;
        expired: number;
        active: number;
    }> {
        const client = PostgresDatabase.getClient();
        
        const query = `
            SELECT 
                COUNT(*) as total,
                COUNT(*) FILTER (WHERE expires_at < NOW()) as expired,
                COUNT(*) FILTER (WHERE expires_at >= NOW()) as active
            FROM ${this.TABLE_NAME}
        `;
        
        const result = await client.query(query);
        return {
            total: parseInt(result.rows[0].total),
            expired: parseInt(result.rows[0].expired),
            active: parseInt(result.rows[0].active)
        };
    }
}
