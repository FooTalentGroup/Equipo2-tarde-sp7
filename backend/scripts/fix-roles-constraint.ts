import 'dotenv/config';
import { PostgresDatabase } from '../src/data/postgres/database';
import { get } from 'env-var';

// Get environment variables
const dbConfig = {
  host: get('POSTGRES_HOST').default('localhost').asString(),
  port: get('POSTGRES_PORT').default(5432).asPortNumber(),
  user: get('POSTGRES_USER').required().asString(),
  password: get('POSTGRES_PASSWORD').required().asString(),
  database: get('POSTGRES_DB').required().asString(),
};

async function fixRolesConstraint() {
  try {
    console.log('🔌 Connecting to database...');
    console.log(`   Host: ${dbConfig.host}:${dbConfig.port}`);
    console.log(`   Database: ${dbConfig.database}`);
    console.log(`   User: ${dbConfig.user}\n`);

    // Initialize database connection
    await PostgresDatabase.connect({
      dbName: dbConfig.database,
      port: dbConfig.port,
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
    });

    console.log('✅ Connection established\n');

    const client = PostgresDatabase.getClient();

    console.log('📦 Fixing roles constraint and updating to lowercase...\n');

    // 1. Drop the old constraint if it exists
    try {
      await client.query('ALTER TABLE roles DROP CONSTRAINT IF EXISTS chk_roles_name');
      console.log('   ✅ Old constraint dropped');
    } catch (error: any) {
      console.log(`   ⚠️  Could not drop old constraint: ${error.message}`);
    }

    // 2. Update existing roles to lowercase if they exist
    try {
      const updateResult = await client.query(`
        UPDATE roles 
        SET name = LOWER(name) 
        WHERE name IN ('Admin', 'Agent')
      `);
      if (updateResult.rowCount && updateResult.rowCount > 0) {
        console.log(`   ✅ Updated ${updateResult.rowCount} role(s) to lowercase`);
      } else {
        console.log('   ℹ️  No roles to update');
      }
    } catch (error: any) {
      console.log(`   ⚠️  Could not update roles: ${error.message}`);
    }

    // 3. Add the new constraint with lowercase values
    try {
      await client.query(`
        ALTER TABLE roles 
        ADD CONSTRAINT chk_roles_name CHECK (name IN ('admin', 'agent'))
      `);
      console.log('   ✅ New constraint added (lowercase)');
    } catch (error: any) {
      if (error.message.includes('already exists')) {
        console.log('   ⚠️  Constraint already exists with correct values');
      } else {
        throw error;
      }
    }

    // 4. Update comments
    try {
      await client.query(`
        COMMENT ON TABLE roles IS 'User roles: admin or agent (lowercase)'
      `);
      await client.query(`
        COMMENT ON COLUMN roles.name IS 'admin or agent (lowercase)'
      `);
      console.log('   ✅ Comments updated');
    } catch (error: any) {
      console.log(`   ⚠️  Could not update comments: ${error.message}`);
    }

    console.log('\n✅ Process completed successfully!\n');

  } catch (error: any) {
    console.error('\n❌ Error fixing roles constraint:');
    console.error(error.message);
    process.exit(1);
  } finally {
    await PostgresDatabase.disconnect();
  }
}

// Execute migration
fixRolesConstraint();


