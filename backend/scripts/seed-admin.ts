import 'dotenv/config';
import { PostgresDatabase } from '../src/data/postgres/database';
import { ProfileModel, RoleModel } from '../src/data/postgres/models';
import { BcryptAdapter } from '../src/config/bcrypt.adaptar';
import { get } from 'env-var';

// Get environment variables
const dbConfig = {
  host: get('POSTGRES_HOST').default('localhost').asString(),
  port: get('POSTGRES_PORT').default(5432).asPortNumber(),
  user: get('POSTGRES_USER').required().asString(),
  password: get('POSTGRES_PASSWORD').required().asString(),
  database: get('POSTGRES_DB').required().asString(),
};

// Admin user data
const adminUser = {
  first_name: 'Admin',
  last_name: 'User',
  email: 'admin@example.com',
  password: 'admin123', // Will be hashed
  phone: undefined as string | undefined,
  whatsapp_number: undefined as string | undefined,
};

async function seedAdmin() {
  const hashAdapter = new BcryptAdapter();

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

    console.log('📦 Seeding admin user...\n');

    // Check if admin user already exists
    const existingAdmin = await ProfileModel.findByEmail(adminUser.email);
    
    if (existingAdmin) {
      console.log(`   ⚠️  Admin user with email "${adminUser.email}" already exists (ID: ${existingAdmin.id})`);
      console.log('   💡 If you want to recreate it, delete it first from the database.\n');
    } else {
      // Get admin role
      const adminRole = await RoleModel.findByTitle('admin');
      if (!adminRole) {
        throw new Error('Admin role not found. Please run "npm run db:seed-roles" first.');
      }

      console.log(`   🔐 Hashing password...`);
      // Hash password
      const hashedPassword = await hashAdapter.hash(adminUser.password);

      console.log(`   👤 Creating admin user...`);
      // Create admin user
      const newAdmin = await ProfileModel.create({
        first_name: adminUser.first_name,
        last_name: adminUser.last_name,
        email: adminUser.email,
        password: hashedPassword,
        phone: adminUser.phone,
        role_id: adminRole.id!,
        whatsapp_number: adminUser.whatsapp_number,
      });

      console.log(`   ✅ Admin user created successfully!`);
      console.log(`      ID: ${newAdmin.id}`);
      console.log(`      Email: ${newAdmin.email}`);
      console.log(`      Name: ${newAdmin.first_name} ${newAdmin.last_name}`);
      console.log(`      Role: admin`);
      console.log(`      📧 Login credentials:`);
      console.log(`         Email: ${adminUser.email}`);
      console.log(`         Password: ${adminUser.password}`);
      console.log('');
    }

    console.log('✅ Process completed successfully!\n');

  } catch (error: any) {
    console.error('\n❌ Error seeding admin user:');
    console.error(error.message);
    process.exit(1);
  } finally {
    await PostgresDatabase.disconnect();
  }
}

// Execute seed
seedAdmin();

