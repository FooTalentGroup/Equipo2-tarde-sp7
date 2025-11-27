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

async function addUpdatedAtColumn() {
  const client = new Client(dbConfig);

  try {
    await client.connect();
    console.log('🔌 Conectado a PostgreSQL\n');

    // Verificar si la columna existe
    const checkQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND table_name = 'properties' 
        AND column_name = 'updated_at';
    `;
    
    const checkResult = await client.query(checkQuery);
    
    if (checkResult.rows.length > 0) {
      console.log('✅ La columna `updated_at` ya existe en la tabla `properties`');
      return;
    }

    // Agregar la columna si no existe
    console.log('📝 Agregando columna `updated_at` a la tabla `properties`...');
    
    const alterQuery = `
      ALTER TABLE properties 
      ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    `;
    
    await client.query(alterQuery);
    console.log('✅ Columna `updated_at` agregada exitosamente\n');

    // Actualizar registros existentes con el timestamp actual
    console.log('🔄 Actualizando registros existentes...');
    const updateQuery = `
      UPDATE properties 
      SET updated_at = CURRENT_TIMESTAMP 
      WHERE updated_at IS NULL;
    `;
    
    const updateResult = await client.query(updateQuery);
    console.log(`✅ ${updateResult.rowCount} registros actualizados\n`);

    // Crear índice si no existe
    console.log('📊 Creando índice en `updated_at`...');
    const indexQuery = `
      CREATE INDEX IF NOT EXISTS idx_properties_updated_at 
      ON properties(updated_at DESC);
    `;
    
    await client.query(indexQuery);
    console.log('✅ Índice creado exitosamente\n');

    console.log('🎉 Migración completada!\n');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await client.end();
  }
}

addUpdatedAtColumn()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));




