import { Client } from 'pg';

interface Options {
    dbName: string;
    port: number;
    host: string;
    user: string;
    password: string;
}

export class PostgresDatabase {
    private static client: Client | null = null;

    static async connect(options: Options): Promise<void> {
        const { dbName, port, host, user, password } = options;
        
        this.client = new Client({
            database: dbName,
            port: port,
            host: host,
            user: user,
            password: password,
        });

        try {
            await this.client.connect();
            console.log('✅ Conexión a PostgreSQL establecida correctamente');
        } catch (error) {
            console.error('❌ Error al conectar a PostgreSQL:', error);
            throw error;
        }
    }

    static async disconnect(): Promise<void> {
        if (this.client) {
            await this.client.end();
            this.client = null;
            console.log('🔌 Desconectado de PostgreSQL');
        }
    }

    static getClient(): Client {
        if (!this.client) {
            throw new Error('No hay conexión activa a PostgreSQL. Debes llamar a connect() primero.');
        }
        return this.client;
    }
}

