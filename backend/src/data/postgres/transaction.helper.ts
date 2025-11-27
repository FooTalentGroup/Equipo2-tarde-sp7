import { PostgresDatabase } from './database';
import { Client } from 'pg';

/**
 * Helper para manejar transacciones de PostgreSQL
 * Asegura que todas las operaciones se ejecuten atómicamente
 * 
 * IMPORTANTE: Los modelos usan PostgresDatabase.getClient() que retorna un singleton.
 * En una transacción, todos los queries deben usar el mismo client.
 * Como los modelos ya usan el mismo singleton, funciona correctamente.
 */
export class TransactionHelper {
    /**
     * Ejecuta una función dentro de una transacción
     * Si hay algún error, hace ROLLBACK automáticamente
     * 
     * @param callback Función que se ejecuta dentro de la transacción
     * @returns El resultado de la función callback
     */
    static async executeInTransaction<T>(
        callback: () => Promise<T>
    ): Promise<T> {
        const client = PostgresDatabase.getClient();
        
        // Iniciar transacción
        await client.query('BEGIN');
        
        try {
            // Ejecutar callback (los modelos usarán el mismo client vía PostgresDatabase.getClient())
            const result = await callback();
            
            // Si todo salió bien, hacer COMMIT
            await client.query('COMMIT');
            
            return result;
        } catch (error) {
            // Si hay error, hacer ROLLBACK
            await client.query('ROLLBACK');
            
            // Re-lanzar el error para que el caller lo maneje
            throw error;
        }
    }
}

