# Módulo de Properties - Arquitectura DDD

Este documento describe la implementación del módulo de Properties siguiendo los principios de Domain-Driven Design (DDD).

## Estructura del Proyecto

```
realestate-app/
├── packages/
│   ├── domain/                           # Capa de Dominio (Lógica de Negocio)
│   │   ├── entities/
│   │   │   └── Property.ts              # Entidad Property con validación Zod
│   │   ├── repositories/
│   │   │   └── PropertyRepository.ts    # Interfaz del repositorio
│   │   ├── use-cases/
│   │   │   └── property/
│   │   │       ├── CreateProperty.ts    # Caso de uso: crear propiedad
│   │   │       ├── GetPropertyById.ts   # Caso de uso: obtener por ID
│   │   │       ├── GetAllProperties.ts  # Caso de uso: obtener todas
│   │   │       ├── UpdateProperty.ts    # Caso de uso: actualizar
│   │   │       ├── DeleteProperty.ts    # Caso de uso: eliminar
│   │   │       └── index.ts            # Exportaciones centralizadas
│   │   └── objects/
│   │       └── Result.ts               # Patrón Result para manejo de errores
│   │
│   └── infrastructure/                   # Capa de Infraestructura
│       └── repositories/
│           └── MockPropertyRepository.ts # Implementación mock del repositorio
│
└── src/                                  # Capa de Aplicación (Next.js)
    ├── app/
    │   └── properties/                   # Rutas de propiedades
    │       ├── page.tsx                 # Lista de propiedades
    │       ├── new/
    │       │   └── page.tsx            # Crear nueva propiedad
    │       └── [id]/
    │           ├── page.tsx            # Detalle de propiedad
    │           ├── edit/
    │           │   └── page.tsx        # Editar propiedad
    │           └── not-found.tsx       # Página 404
    │
    ├── modules/
    │   └── properties/
    │       ├── actions/                 # Server Actions
    │       │   ├── create-property-action.ts
    │       │   ├── get-property-action.ts
    │       │   ├── get-all-properties-action.ts
    │       │   ├── update-property-action.ts
    │       │   └── delete-property-action.ts
    │       └── components/              # Componentes UI
    │           ├── PropertyForm.tsx
    │           ├── PropertyCard.tsx
    │           ├── PropertyList.tsx
    │           ├── PropertyDetail.tsx
    │           └── DeletePropertyButton.tsx
    │
    └── lib/
        └── paths.ts                     # Definición centralizada de rutas
```

## Capas de la Arquitectura

### 1. Capa de Dominio (Domain Layer)

La capa de dominio contiene la lógica de negocio pura, independiente de frameworks.

#### Entidades

**Property.ts**: Define la estructura de una propiedad con validación Zod.

```typescript
export type Property = {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};
```

**Códigos de Error**:
- `PROPERTY_NOT_FOUND_ERROR`
- `PROPERTY_CREATE_ERROR`
- `PROPERTY_UPDATE_ERROR`
- `PROPERTY_DELETE_ERROR`
- `PROPERTY_VALIDATION_ERROR`

#### Repository Interface

Define el contrato para acceso a datos sin implementación:

```typescript
export type PropertyRepository = {
  create: (input: { propertyData: PropertyCreateInput }) => AsyncResult<...>
  getById: (input: { id: string }) => AsyncResult<...>
  getAll: () => AsyncResult<...>
  update: (input: { id: string; propertyData: PropertyUpdateInput }) => AsyncResult<...>
  delete: (input: { id: string }) => AsyncResult<...>
}
```

#### Use Cases

Cada caso de uso encapsula una operación de negocio:

1. **CreateProperty**: Valida y crea una nueva propiedad
2. **GetPropertyById**: Obtiene una propiedad por ID
3. **GetAllProperties**: Lista todas las propiedades
4. **UpdateProperty**: Actualiza una propiedad existente
5. **DeleteProperty**: Elimina una propiedad

### 2. Capa de Infraestructura (Infrastructure Layer)

Contiene implementaciones concretas de las interfaces del dominio.

#### MockPropertyRepository

Implementación en memoria del repositorio para desarrollo:

- Almacenamiento en array en memoria
- Operaciones CRUD completas
- Funciones helper para testing (`resetMockProperties`, `seedMockProperties`)

### 3. Capa de Aplicación (Application Layer)

Conecta el dominio con Next.js.

#### Server Actions

Punto de entrada desde el UI, coordinan casos de uso:

- `createPropertyAction`: Crea y redirige a detalle
- `getPropertyAction`: Obtiene una propiedad
- `getAllPropertiesAction`: Lista todas las propiedades
- `updatePropertyAction`: Actualiza y revalida cache
- `deletePropertyAction`: Elimina y redirige a lista

#### Componentes

**PropertyForm**: Formulario reutilizable con validación
**PropertyCard**: Tarjeta para vista de lista
**PropertyList**: Grid de propiedades
**PropertyDetail**: Vista detallada
**DeletePropertyButton**: Botón con confirmación

#### Páginas

- `/properties` - Lista de propiedades
- `/properties/new` - Crear propiedad
- `/properties/[id]` - Detalle de propiedad
- `/properties/[id]/edit` - Editar propiedad

## Flujo de Datos

### Crear una Propiedad

```
Usuario → PropertyForm → createPropertyAction → createPropertyUseCase →
mockPropertyRepository.create → Result<{ id }> → revalidatePath → redirect
```

### Obtener Propiedades

```
Página → getAllPropertiesAction → getAllPropertiesUseCase →
mockPropertyRepository.getAll → Result<Property[]> → PropertyList → PropertyCard
```

## Manejo de Errores

Utilizamos el **Result Pattern** para manejo de errores funcional:

```typescript
type Result<T, E> = Ok<T> | Err<E>
```

Ventajas:
- Type-safe: TypeScript conoce los tipos de error posibles
- Explícito: Obliga a manejar errores
- Composable: Fácil de encadenar operaciones

Ejemplo:

```typescript
const result = await createPropertyUseCase(deps, input);

if (!result.ok) {
  // result.error es de tipo PropertyError
  return { error: result.error };
}

// result.data es de tipo Pick<Property, "id">
return { data: result.data };
```

## Validación

La validación se realiza en múltiples niveles:

1. **UI (PropertyForm)**: Validación con Zod y React Hook Form
2. **Use Cases**: Validación de lógica de negocio
3. **Repository**: Validación de persistencia

## Características Implementadas

- ✅ CRUD completo de propiedades
- ✅ Validación con Zod
- ✅ Manejo de errores con Result Pattern
- ✅ Componentes reutilizables
- ✅ Server Actions para mutaciones
- ✅ Cache revalidation con Next.js
- ✅ Rutas tipadas centralizadas
- ✅ Confirmación para eliminación
- ✅ Página 404 personalizada
- ✅ Metadata SEO dinámica

## Info List: false

Actualmente, el módulo utiliza una implementación **mock en memoria** (`MockPropertyRepository`):

- **Propósito**: Desarrollo y prototipado rápido
- **Persistencia**: Los datos se pierden al reiniciar la aplicación
- **Testing**: Ideal para tests unitarios

### Próximos Pasos (cuando info list sea true)

Cuando necesites persistencia real:

1. Crear `DatabasePropertyRepository` en `packages/infrastructure/repositories/`
2. Conectar con Prisma/Drizzle/otro ORM
3. Implementar el mismo contrato de `PropertyRepository`
4. Cambiar en las actions de mock a database repository

```typescript
// Antes (mock)
const repo = mockPropertyRepository();

// Después (database)
const repo = databasePropertyRepository({ db, logger });
```

## Ventajas de esta Arquitectura

1. **Separación de Concerns**: Cada capa tiene una responsabilidad clara
2. **Testeable**: Fácil mock de dependencias
3. **Mantenible**: Cambios localizados
4. **Escalable**: Fácil agregar nuevas features
5. **Type-Safe**: TypeScript en todas las capas
6. **Flexible**: Fácil cambiar implementaciones (mock → database)

## Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Modo desarrollo
npm run dev

# Build producción
npm run build

# Lint
npm run lint

# Format
npm run format
```

## Rutas Disponibles

- `http://localhost:3000/properties` - Lista
- `http://localhost:3000/properties/new` - Crear
- `http://localhost:3000/properties/[id]` - Detalle
- `http://localhost:3000/properties/[id]/edit` - Editar

## Tecnologías Utilizadas

- **Next.js 16**: Framework React con App Router
- **React 19**: Librería UI
- **TypeScript**: Type safety
- **Zod**: Validación de esquemas
- **React Hook Form**: Manejo de formularios
- **Radix UI**: Componentes accesibles
- **Tailwind CSS**: Estilos
- **shadcn/ui**: Sistema de componentes

---

**Nota**: Este módulo está completamente implementado siguiendo DDD y listo para usar con datos mock. Para persistencia real, implementa `DatabasePropertyRepository` siguiendo el mismo contrato.
