import 'dotenv/config';
import { get } from 'env-var';


export const envs = {

  PORT: get('PORT').required().asPortNumber(),

  POSTGRES_DB: get('POSTGRES_DB').required().asString(),
  POSTGRES_USER: get('POSTGRES_USER').required().asString(),
  POSTGRES_PASSWORD: get('POSTGRES_PASSWORD').required().asString(),
  POSTGRES_HOST: get('POSTGRES_HOST').default('localhost').asString(),
  POSTGRES_PORT: get('POSTGRES_PORT').default(5432).asPortNumber(),
  
  DB_POOL_MAX: get('DB_POOL_MAX').default(20).asIntPositive(),
  DB_POOL_MIN: get('DB_POOL_MIN').default(5).asIntPositive(),
  DB_POOL_IDLE_TIMEOUT: get('DB_POOL_IDLE_TIMEOUT').default(30000).asIntPositive(),
  DB_POOL_CONNECTION_TIMEOUT: get('DB_POOL_CONNECTION_TIMEOUT').default(2000).asIntPositive(),

  JWT_SECRET: get('JWT_SECRET').required().asString(),

  CLOUDINARY_CLOUD_NAME: get('CLOUDINARY_CLOUD_NAME').asString(),
  CLOUDINARY_API_KEY: get('CLOUDINARY_API_KEY').asString(),
  CLOUDINARY_API_SECRET: get('CLOUDINARY_API_SECRET').asString(),
  CLOUDINARY_URL: get('CLOUDINARY_URL').asString(),

}



