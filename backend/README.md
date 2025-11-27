# Backend - Real Estate Management System

Backend desarrollado con TypeScript, Express y PostgreSQL siguiendo Clean Architecture.

## 🏗️ Arquitectura

El proyecto sigue **Clean Architecture** con separación de capas:

- **Domain**: Entidades, DTOs, Use Cases, Interfaces (reglas de negocio puras)
- **Data**: Modelos de base de datos, adaptadores de datos
- **Presentation**: Controllers, Services, Routes, Middlewares

## 📁 Estructura del Proyecto

```
src/
├── config/          # Configuración (JWT, Bcrypt, Cloudinary, envs)
├── data/            # Capa de datos (modelos PostgreSQL)
├── domain/          # Capa de dominio (entities, DTOs, use cases)
└── presentation/    # Capa de presentación (controllers, services, routes, middlewares)
```

## 🚀 Instalación

1. Copiar `.env.template` a `.env` y configurar las variables de entorno
2. Ejecutar `npm install` para instalar las dependencias
3. Configurar `docker-compose.yml` y ejecutar `docker-compose up -d` para levantar PostgreSQL
4. Ejecutar `npm run db:setup` para crear la base de datos y datos iniciales
5. Ejecutar `npm run dev` para levantar el proyecto en modo desarrollo

## ⚙️ Variables de Entorno

### Requeridas

```env
PORT=3000
POSTGRES_DB=nombre_de_tu_base_de_datos
POSTGRES_USER=tu_usuario
POSTGRES_PASSWORD=tu_contraseña
JWT_SECRET=tu_secret_key_super_segura_minimo_32_caracteres
```

### Opcionales con Valores por Defecto

```env
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
DB_POOL_MAX=20
DB_POOL_MIN=5
DB_POOL_IDLE_TIMEOUT=30000
DB_POOL_CONNECTION_TIMEOUT=2000
```

### Opcionales (Cloudinary)

```env
CLOUDINARY_CLOUD_NAME=tu-cloud-name
CLOUDINARY_API_KEY=tu-api-key
CLOUDINARY_API_SECRET=tu-api-secret
```

### Para Docker Compose

```env
PGADMIN_EMAIL=admin@admin.com
PGADMIN_PASSWORD=tu_contraseña_pgadmin
PGADMIN_PORT=5050
```

**Nota:** Copia `.env.template` a `.env` y configura las variables según tu entorno.

## 📜 Scripts Disponibles

- `npm run dev` - Inicia el servidor en modo desarrollo
- `npm run build` - Compila TypeScript a JavaScript
- `npm run start` - Compila y ejecuta en producción
- `npm run db:migrate` - Ejecuta las migraciones de la base de datos
- `npm run db:setup` - Configura la base de datos completa (migrate + seeds)
- `npm run db:reset` - Resetea la base de datos (drop + migrate + seeds)
- `npm run db:drop` - Elimina todas las tablas
- `npm run db:check` - Verifica el estado de la base de datos

## 🛣️ Endpoints

Para ver la documentación completa de todos los endpoints, consulta [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### Resumen de Endpoints

- **Autenticación**: `/auth/*` - Login, registro, validación de email
- **REST API**: `/rest/v1/*` - CRUD completo para todos los recursos
- **Funciones**: `/functions/v1/*` - Funciones especiales (crear propiedad completa)

## 🔐 Autenticación

La mayoría de endpoints requieren autenticación JWT. Incluye el token en el header:

```
Authorization: Bearer <tu-token-jwt>
```

## 📦 Tecnologías

- **TypeScript** - Lenguaje de programación
- **Express** - Framework web
- **PostgreSQL** - Base de datos
- **JWT** - Autenticación
- **Bcrypt** - Hash de contraseñas
- **Cloudinary** - Almacenamiento de imágenes
- **Multer** - Manejo de archivos multipart/form-data

## 🏛️ Patrones Implementados

- **Clean Architecture** - Separación de capas
- **Adapter Pattern** - Para Hash, JWT y FileUpload
- **Repository Pattern** - Para acceso a datos
- **DTO Pattern** - Para validación de entrada
- **Use Cases** - Para reglas de negocio

## 📝 Notas

- Todas las operaciones complejas usan transacciones atómicas
- Los endpoints de ubicación implementan "Get or Create" para evitar duplicados
- El sistema soporta subida de imágenes mediante Cloudinary o URLs externas
