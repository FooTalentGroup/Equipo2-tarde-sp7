import { Pool, PoolClient, QueryResult } from 'pg';
import { envs } from '../../config/envs';
import { SqlParams } from '../types/sql.types';

interface Options {
    dbName: string;
    port: number;
    host: string;
    user: string;
    password: string;
}

export class PostgresDatabase {
    private static pool: Pool | null = null;

    static async connect(options: Options): Promise<void> {
        const { dbName, port, host, user, password } = options;
        
        this.pool = new Pool({
            database: dbName,
            port: port,
            host: host,
            user: user,
            password: password,
            max: envs.DB_POOL_MAX,
            min: envs.DB_POOL_MIN,
            idleTimeoutMillis: envs.DB_POOL_IDLE_TIMEOUT,
            connectionTimeoutMillis: envs.DB_POOL_CONNECTION_TIMEOUT,
            allowExitOnIdle: false,
        });

        this.pool.on('error', (err) => {
            console.error('❌ Error inesperado en cliente inactivo del pool:', err);
        });

        try {
            const testClient = await this.pool.connect();
            testClient.release();
            console.log(`✅ Connection pool establecido correctamente (max: ${envs.DB_POOL_MAX}, min: ${envs.DB_POOL_MIN})`);
        } catch (error) {
            console.error('❌ Error al establecer connection pool:', error);
            if (this.pool) {
                await this.pool.end();
                this.pool = null;
            }
            throw error;
        }
    }

    static async disconnect(): Promise<void> {
        if (this.pool) {
            await this.pool.end();
            this.pool = null;
            console.log('🔌 Connection pool cerrado');
        }
    }

    static getPool(): Pool {
        if (!this.pool) {
            throw new Error('No hay pool activo a PostgreSQL. Debes llamar a connect() primero.');
        }
        return this.pool;
    }

    static async query<T = any>(text: string, params?: SqlParams): Promise<QueryResult<T>> {
        if (!this.pool) {
            throw new Error('No hay pool activo a PostgreSQL. Debes llamar a connect() primero.');
        }
        return await this.pool.query(text, params);
    }

    /**
     * Obtiene un cliente del pool para transacciones.
     * IMPORTANTE: Siempre llamar client.release() después de usarlo.
     */
    static async getPoolClient(): Promise<PoolClient> {
        if (!this.pool) {
            throw new Error('No hay pool activo a PostgreSQL. Debes llamar a connect() primero.');
        }
        return await this.pool.connect();
    }

    /**
     * @deprecated Usa query() para queries normales o getPoolClient() para transacciones.
     */
    static getClient(): Pool {
        return this.getPool();
    }
}

