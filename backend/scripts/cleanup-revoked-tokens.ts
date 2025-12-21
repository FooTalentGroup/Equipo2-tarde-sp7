import 'dotenv/config';
import { RevokedTokenModel } from '../src/data/postgres/models/revoked-token.model';
import { PostgresDatabase } from '../src/data/postgres/database';
import { get } from 'env-var';

const dbConfig = {
  host: get('POSTGRES_HOST').default('localhost').asString(),
  port: get('POSTGRES_PORT').default(5432).asPortNumber(),
  user: get('POSTGRES_USER').required().asString(),
  password: get('POSTGRES_PASSWORD').required().asString(),
  database: get('POSTGRES_DB').required().asString(),
};

async function cleanupRevokedTokens() {
    try {
        console.log('🧹 Starting cleanup of expired revoked tokens...');
        console.log(`📅 Current time: ${new Date().toISOString()}`);
        console.log(`   Host: ${dbConfig.host}:${dbConfig.port}`);
        console.log(`   Database: ${dbConfig.database}\n`);
        
        await PostgresDatabase.connect({
            dbName: dbConfig.database,
            port: dbConfig.port,
            host: dbConfig.host,
            user: dbConfig.user,
            password: dbConfig.password
        });
        
        console.log('✅ Database connected\n');
        
        const statsBefore = await RevokedTokenModel.getStats();
        console.log(`📊 Before cleanup:`);
        console.log(`   - Total tokens: ${statsBefore.total}`);
        console.log(`   - Active tokens: ${statsBefore.active}`);
        console.log(`   - Expired tokens: ${statsBefore.expired}`);
        
        const deleted = await RevokedTokenModel.cleanExpiredTokens();
        
        console.log(`\n✅ Cleaned up ${deleted} expired tokens`);
        
        const statsAfter = await RevokedTokenModel.getStats();
        console.log(`\n📊 After cleanup:`);
        console.log(`   - Total tokens: ${statsAfter.total}`);
        console.log(`   - Active tokens: ${statsAfter.active}`);
        console.log(`   - Expired tokens: ${statsAfter.expired}`);
        
        console.log('\n✨ Cleanup completed successfully!\n');
        
    } catch (error: any) {
        console.error('\n❌ Error during cleanup:');
        console.error(error.message);
        process.exit(1);
    } finally {
        await PostgresDatabase.disconnect();
    }
}

cleanupRevokedTokens();

