import 'dotenv/config';
import { Client } from 'pg';
import { readFileSync } from 'fs';
import { join } from 'path';
import { get } from 'env-var';

// Obtener variables de entorno
const dbConfig = {
  host: get('POSTGRES_HOST').default('localhost').asString(),
  port: get('POSTGRES_PORT').default(5432).asPortNumber(),
  user: get('POSTGRES_USER').required().asString(),
  password: get('POSTGRES_PASSWORD').required().asString(),
  database: get('POSTGRES_DB').required().asString(),
};

async function migrateDatabase() {
  const client = new Client(dbConfig);

  try {
    console.log('🔌 Conectando a PostgreSQL...');
    console.log(`   Host: ${dbConfig.host}:${dbConfig.port}`);
    console.log(`   Database: ${dbConfig.database}`);
    console.log(`   User: ${dbConfig.user}`);

    await client.connect();
    console.log('✅ Conexión establecida\n');

    // Leer el archivo SQL
    const sqlPath = join(process.cwd(), 'src/data/postgres/models/schema.sql');
    console.log(`📄 Leyendo archivo SQL: ${sqlPath}`);
    
    const sql = readFileSync(sqlPath, 'utf-8');
    
    console.log('📦 Procesando script SQL...\n');

    // Dividir el SQL por sentencias correctamente
    // Eliminar comentarios primero para simplificar el parsing
    let cleanSql = sql
      // Eliminar comentarios de línea (-- ...)
      .replace(/--.*$/gm, '')
      // Eliminar comentarios multilínea (/* ... */)
      .replace(/\/\*[\s\S]*?\*\//g, '');
    
    // Dividir por punto y coma, filtrar líneas vacías
    // Mejorar el parsing para manejar mejor las sentencias complejas
    const statements = cleanSql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => {
        // Filtrar líneas vacías y comentarios residuales
        const trimmed = stmt.trim();
        return trimmed.length > 0 && 
               !trimmed.match(/^\s*$/) &&
               !trimmed.match(/^COMMENT\s+ON/i); // Filtrar comentarios que pueden causar problemas
      });

    console.log(`📦 Ejecutando ${statements.length} sentencias SQL...\n`);

    let successCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    // Ejecutar cada sentencia
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      if (statement.length === 0) continue;

      try {
        await client.query(statement);
        successCount++;
        
        // Extraer nombre de la tabla/objeto creado para mostrar mensaje descriptivo
        const createMatch = statement.match(/CREATE\s+(?:TABLE|EXTENSION|INDEX)\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:public\.)?["']?(\w+)["']?/i);
        const objectName = createMatch ? createMatch[1] : null;
        
        if (objectName) {
          const type = statement.match(/CREATE\s+(\w+)/i)?.[1]?.toLowerCase() || 'objeto';
          console.log(`   ✅ [${i + 1}/${statements.length}] ${type}: ${objectName}`);
        } else {
          const firstLine = statement.split('\n').find(line => {
            const trimmed = line.trim();
            return trimmed && !trimmed.startsWith('--');
          }) || '';
          const preview = firstLine.substring(0, 60).trim() || `Sentencia ${i + 1}`;
          console.log(`   ✅ [${i + 1}/${statements.length}] ${preview}...`);
        }
      } catch (err: any) {
        // Si es un error de "already exists" o constraint duplicada, lo ignoramos
        const errorMessage = err.message.toLowerCase();
        if (errorMessage.includes('already exists') || 
            errorMessage.includes('does not exist') ||
            errorMessage.includes('duplicate key') ||
            errorMessage.includes('duplicate') ||
            errorMessage.includes('cannot be implemented') ||
            errorMessage.includes('constraint') && errorMessage.includes('already')) {
          skippedCount++;
          
          const createMatch = statement.match(/CREATE\s+(?:TABLE|EXTENSION|INDEX)\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:public\.)?["']?(\w+)["']?/i);
          const objectName = createMatch ? createMatch[1] : null;
          
          if (objectName) {
            console.log(`   ⚠️  [${i + 1}/${statements.length}] ${objectName} - Ya existe (se ignora)`);
          } else {
            const firstLine = statement.split('\n').find(line => {
              const trimmed = line.trim();
              return trimmed && !trimmed.startsWith('--');
            }) || '';
            const preview = firstLine.substring(0, 60).trim() || `Sentencia ${i + 1}`;
            console.log(`   ⚠️  [${i + 1}/${statements.length}] ${preview} - Ya existe (se ignora)`);
          }
        } else {
          errorCount++;
          console.error(`   ❌ [${i + 1}/${statements.length}] Error:`, err.message);
          const preview = statement.substring(0, 200).replace(/\n/g, ' ');
          console.error(`   SQL: ${preview}...`);
          throw err;
        }
      }
    }

    console.log(`\n📊 Resumen:`);
    console.log(`   ✅ Exitosas: ${successCount}`);
    if (skippedCount > 0) console.log(`   ⚠️  Omitidas (ya existían): ${skippedCount}`);
    if (errorCount > 0) console.log(`   ❌ Errores: ${errorCount}`);

    console.log('\n✅ Base de datos montada correctamente!');
    console.log('🎉 Todas las tablas han sido creadas.\n');

  } catch (error: any) {
    console.error('\n❌ Error al montar la base de datos:');
    console.error(error.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log('🔌 Conexión cerrada');
  }
}

// Ejecutar la migración
migrateDatabase();

