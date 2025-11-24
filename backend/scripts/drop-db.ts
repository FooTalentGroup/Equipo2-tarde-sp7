import 'dotenv/config';
import { Client } from 'pg';
import { get } from 'env-var';

// Obtener variables de entorno
const dbConfig = {
  host: get('POSTGRES_HOST').default('localhost').asString(),
  port: get('POSTGRES_PORT').default(5432).asPortNumber(),
  user: get('POSTGRES_USER').required().asString(),
  password: get('POSTGRES_PASSWORD').required().asString(),
  database: get('POSTGRES_DB').required().asString(),
};

// Orden inverso para eliminar tablas (respetando foreign keys)
const tablesToDrop = [
  // Tablas de relación (primero)
  'property_amenities',
  'property_services',
  'property_images',
  'contracts',
  'rentals',
  'leads',
  'audit_log',
  
  // Tablas principales
  'properties',
  'clients',
  'profiles',
  
  // Tablas de ubicación (en orden inverso de dependencias)
  'addresses',
  'departments',
  'cities',
  'countries',
  
  // Tablas de lookup
  'amenities',
  'services',
  'lead_status',
  'operation_types',
  'property_status',
  'property_types',
  'roles',
];

async function dropDatabase() {
  const client = new Client(dbConfig);

  try {
    console.log('🔌 Conectando a PostgreSQL...');
    console.log(`   Host: ${dbConfig.host}:${dbConfig.port}`);
    console.log(`   Database: ${dbConfig.database}`);
    console.log(`   User: ${dbConfig.user}`);

    await client.connect();
    console.log('✅ Conexión establecida\n');

    console.log('⚠️  ADVERTENCIA: Se eliminarán TODAS las tablas de la base de datos\n');
    console.log(`📦 Eliminando ${tablesToDrop.length} tablas...\n`);

    let droppedCount = 0;
    let notFoundCount = 0;

    // Eliminar tablas en orden inverso
    for (let i = 0; i < tablesToDrop.length; i++) {
      const tableName = tablesToDrop[i];
      
      try {
        // Usar DROP TABLE IF EXISTS CASCADE para eliminar dependencias automáticamente
        const query = `DROP TABLE IF EXISTS ${tableName} CASCADE`;
        await client.query(query);
        droppedCount++;
        console.log(`   ✅ [${i + 1}/${tablesToDrop.length}] Tabla eliminada: ${tableName}`);
      } catch (error: any) {
        if (error.message.includes('does not exist') || 
            error.message.includes('not exist')) {
          notFoundCount++;
          console.log(`   ⚠️  [${i + 1}/${tablesToDrop.length}] Tabla no existe: ${tableName}`);
        } else {
          console.error(`   ❌ [${i + 1}/${tablesToDrop.length}] Error al eliminar ${tableName}:`, error.message);
          throw error;
        }
      }
    }

    // Intentar eliminar extensiones (opcional, puede fallar si no existen)
    console.log('\n📦 Eliminando extensiones...\n');
    
    try {
      await client.query('DROP EXTENSION IF EXISTS "pgcrypto" CASCADE');
      console.log('   ✅ Extensión eliminada: pgcrypto');
    } catch (error: any) {
      if (error.message.includes('does not exist')) {
        console.log('   ⚠️  Extensión no existe: pgcrypto');
      } else {
        console.log(`   ⚠️  No se pudo eliminar extensión: ${error.message}`);
      }
    }

    console.log(`\n📊 Resumen:`);
    console.log(`   ✅ Eliminadas: ${droppedCount}`);
    if (notFoundCount > 0) console.log(`   ⚠️  No encontradas: ${notFoundCount}`);

    console.log('\n✅ Base de datos reseteada correctamente!');
    console.log('🎉 Todas las tablas han sido eliminadas.\n');
    console.log('💡 Puedes ejecutar "npm run db:migrate" para recrearlas.\n');

  } catch (error: any) {
    console.error('\n❌ Error al eliminar la base de datos:');
    console.error(error.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log('🔌 Conexión cerrada');
  }
}

// Ejecutar el drop
dropDatabase();


