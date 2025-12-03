import { PostgresDatabase } from './database';
import { PoolClient } from 'pg';

export class TransactionHelper {
    /**
     * Ejecuta una función dentro de una transacción.
     * Todas las operaciones de BD dentro del callback deben usar el cliente proporcionado.
     */
    static async executeInTransaction<T>(
        callback: (client: PoolClient) => Promise<T>
    ): Promise<T> {
        const client = await PostgresDatabase.getPoolClient();
        
        try {
            await client.query('BEGIN');
            const result = await callback(client);
            await client.query('COMMIT');
            return result;
        } catch (error) {
            await client.query('ROLLBACK').catch(() => {
                // Ignorar errores en ROLLBACK
            });
            throw error;
        } finally {
            client.release();
        }
    }
}

