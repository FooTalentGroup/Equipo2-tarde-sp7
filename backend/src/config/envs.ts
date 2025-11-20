import 'dotenv/config';
import { get } from 'env-var';


export const envs = {

  PORT: get('PORT').required().asPortNumber(),

  // PostgreSQL
  POSTGRES_DB: get('POSTGRES_DB').required().asString(),
  POSTGRES_USER: get('POSTGRES_USER').required().asString(),
  POSTGRES_PASSWORD: get('POSTGRES_PASSWORD').required().asString(),
  POSTGRES_HOST: get('POSTGRES_HOST').default('localhost').asString(),
  POSTGRES_PORT: get('POSTGRES_PORT').default(5432).asPortNumber(),

  JWT_SECRET: get('JWT_SECRET').required().asString(),

  // Cloudinary - Prioridad: variables individuales (más fáciles de modificar)
  CLOUDINARY_CLOUD_NAME: get('CLOUDINARY_CLOUD_NAME').asString(),
  CLOUDINARY_API_KEY: get('CLOUDINARY_API_KEY').asString(),
  CLOUDINARY_API_SECRET: get('CLOUDINARY_API_SECRET').asString(),
  // Fallback: CLOUDINARY_URL (formato: cloudinary://api_key:api_secret@cloud_name)
  CLOUDINARY_URL: get('CLOUDINARY_URL').asString(),

}



