# Documentación del Frontend - RedProp

## Visión General
El frontend de RedProp es una aplicación web moderna construida con **Next.js 16**, **React 19** y **Tailwind CSS**. Enfatiza el rendimiento, la accesibilidad y una experiencia de usuario premium.

## 🛠️ Stack Tecnológico

### Core
*   **Framework**: Next.js 16 (App Router)
*   **Librería**: React 19
*   **Lenguaje**: TypeScript 5
*   **Estilos**: Tailwind CSS 4

### UI y Componentes
*   **Sistema**: shadcn/ui
*   **Primitivos**: Radix UI
*   **Iconos**: Lucide React
*   **Gráficos**: Recharts (si aplica)

### Estado y Formularios
*   **Formularios**: React Hook Form
*   **Validación**: Zod
*   **Estado del Servidor**: React Query (TanStack Query) - *Recomendado/Si se usa*

### Calidad
*   **Linting**: Biome
*   **Formateo**: Biome

### Control de Versiones
*   **Hooks**: Husky (pre-commit, commit-msg)
*   **Estándar**: Commitlint (Conventional Commits)

## 🚀 Primeros Pasos

### Requisitos Previos
*   Node.js v20.x+
*   npm (no usar yarn/pnpm para evitar conflictos de lockfile)

### Instalación
1.  **Navegar e Instalar**
    Dado que este es un **monorepo**, asegúrate de entrar al directorio del frontend antes de instalar:
    ```bash
    cd frontend
    npm install
    ```

2.  **Configuración de Entorno**
    ```bash
    cp .env.example .env.local
    ```

3.  **Iniciar Servidor de Desarrollo**
    ```bash
    npm run dev
    ```
    Visita `http://localhost:3000`.

## 📐 Estructura del Proyecto
```
src/
├── app/                  # Páginas y layouts de Next.js App Router
├── components/           # Componentes React
│   ├── ui/               # Componentes flexibles de shadcn/ui
│   └── ...               # Componentes específicos de funcionalidades
├── hooks/                # Hooks personalizados de React
├── lib/                  # Utilidades (clientes api, formateadores)
├── modules/              # Organización basada en características (opcional pero recomendada)
└── styles/               # Estilos globales
```

## 🧩 Conceptos Clave

### Sistema de Diseño
Usamos **shadcn/ui**, lo que significa que los componentes se copian en tu base de código (`src/components/ui`). Tienes control total sobre ellos.
*   Personaliza en `tailwind.config.ts` (o variables CSS).
*   Usa `class-variance-authority` (cva) para variantes de componentes.

### Obtención de Datos (Data Fetching)
*   Usa **Server Actions** para mutaciones e interacciones seguras con el backend.
*   Usa `fetch` estándar o React Query para la carga de datos.

## 🛡️ Estándares de Commit
Utilizamos **Husky** y **Commitlint** para asegurar mensajes de commit consistentes.

**Formato Requerido**: `tipo: descripción` (ej: `feat: agregar filtro de búsqueda`)

| Tipo | Descripción |
| :--- | :--- |
| `feat` | Nueva funcionalidad |
| `fix` | Corrección de errores |
| `docs` | Cambios en documentación |
| `style` | Formato (espacios, etc) |
| `refactor` | Refactorización de código |
| `test` | Tests nuevos o corregidos |
| `chore` | Mantenimiento, dependencias |

> ⚠️ Los commits que no cumplan este formato serán rechazados automáticamente.

## 📝 Scripts
*   `npm run dev`: Iniciar servidor de desarrollo.
*   `npm run build`: Construcción (build) de producción.
*   `npm run start`: Iniciar servidor de producción.
*   `npm run lint`: Ejecutar comprobaciones de Biome.
*   `npm run format`: Corregir formato con Biome.
