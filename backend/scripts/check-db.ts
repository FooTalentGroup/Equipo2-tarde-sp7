import 'dotenv/config';
import { Client } from 'pg';
import { get } from 'env-var';

const dbConfig = {
  host: get('POSTGRES_HOST').default('localhost').asString(),
  port: get('POSTGRES_PORT').default(5432).asPortNumber(),
  user: get('POSTGRES_USER').required().asString(),
  password: get('POSTGRES_PASSWORD').required().asString(),
  database: get('POSTGRES_DB').required().asString(),
};

async function checkDatabase() {
  const client = new Client(dbConfig);

  try {
    console.log('🔌 Conectando a PostgreSQL...');
    console.log(`   Host: ${dbConfig.host}:${dbConfig.port}`);
    console.log(`   Database: ${dbConfig.database}`);
    console.log(`   User: ${dbConfig.user}\n`);

    await client.connect();
    console.log('✅ Conexión establecida correctamente!\n');

    const versionResult = await client.query('SELECT version()');
    console.log('📊 Versión de PostgreSQL:');
    console.log(`   ${versionResult.rows[0].version.split(',')[0]}\n`);

    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log(`📋 Tablas en la base de datos (${tablesResult.rows.length}):`);
    if (tablesResult.rows.length === 0) {
      console.log('   ⚠️  No hay tablas creadas aún');
      console.log('   💡 Ejecuta: npm run db:migrate\n');
    } else {
      tablesResult.rows.forEach((row, index) => {
        console.log(`   ${index + 1}. ${row.table_name}`);
      });
      console.log('');
    }


    const extensionsResult = await client.query(`
      SELECT extname 
      FROM pg_extension 
      ORDER BY extname;
    `);

    console.log(`🔌 Extensiones instaladas (${extensionsResult.rows.length}):`);
    if (extensionsResult.rows.length === 0) {
      console.log('   ⚠️  No hay extensiones instaladas');
    } else {
      extensionsResult.rows.forEach((row, index) => {
        console.log(`   ${index + 1}. ${row.extname}`);
      });
    }
    console.log('');

   
    if (tablesResult.rows.length > 0) {
      console.log('📊 Registros por tabla:');
      for (const row of tablesResult.rows) {
        try {
          const countResult = await client.query(`SELECT COUNT(*) as count FROM ${row.table_name}`);
          const count = parseInt(countResult.rows[0].count);
          console.log(`   ${row.table_name}: ${count} registro(s)`);
        } catch (err: any) {
          console.log(`   ${row.table_name}: Error al contar`);
        }
      }
      console.log('');
    }

    console.log('✅ Verificación completada!\n');

  } catch (error: any) {
    console.error('\n❌ Error al conectar a la base de datos:');
    console.error(`   ${error.message}\n`);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.error('💡 Posibles soluciones:');
      console.error('   1. Verifica que el contenedor esté corriendo: docker compose ps');
      console.error('   2. Inicia el contenedor: docker compose up -d');
      console.error('   3. Verifica las variables de entorno en .env\n');
    } else if (error.message.includes('password authentication')) {
      console.error('💡 Verifica las credenciales en tu archivo .env\n');
    } else if (error.message.includes('database')) {
      console.error('💡 Verifica que la base de datos exista\n');
    }
    
    process.exit(1);
  } finally {
    await client.end();
    console.log('🔌 Conexión cerrada');
  }
}
checkDatabase();


