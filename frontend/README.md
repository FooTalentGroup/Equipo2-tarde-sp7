# RedProp Frontend

## 🖥️ Visión General
Frontend de última generación construido para alto rendimiento y escalabilidad.

## 🔥 Aspectos Destacados del Frontend

### 🛠️ Stack Tecnológico Premium
*   **Core**: [Next.js v16.0.7](https://nextjs.org/) (App Router) & [React v18.2.0](https://react.dev/)
*   **Lenguaje**: [TypeScript v5+](https://www.typescriptlang.org/)
*   **Estilos**: [Tailwind CSS v4](https://tailwindcss.com/) (Alpha/Beta) & [shadcn/ui](https://ui.shadcn.com/)
*   **Estado del Servidor**: [TanStack Query v5](https://tanstack.com/query/latest)
*   **Formularios**: [React Hook Form v7](https://react-hook-form.com/) + [Zod v4](https://zod.dev/)
*   **Testing**: [Vitest v4](https://vitest.dev/)
*   **Calidad de Código**: [Biome](https://biomejs.dev/)

### ⚡ Capa de API "Axios-like" (Optimizado para Next.js)
Aunque el proyecto incluye `axios` en `package.json`, la arquitectura implementa un **Cliente HTTP Personalizado** (`src/lib/axios.ts`) que envuelve la API nativa `fetch`.
*   **¿Por qué?**: Para aprovechar al máximo el sistema de **Caching y Deduplicación de Requests** nativo de Next.js 16, que `axios` no soporta nativamente.
*   **Interfaz Familiar**: Mantiene métodos tipo `api.get`, `api.post` para facilitar la transición a desarrolladores acostumbrados a Axios.
*   **Manejo de Tokens**: Gestión automática de tokens JWT tanto en Server Components (cookies) como en Cliente (localStorage).

### 💎 UX/UI de Alto Nivel
*   **Componentes Radix UI**: Accesibilidad garantizada "out-of-the-box".
*   **Sonner**: Sistema de notificaciones toast minimalista y performante.
*   **Nuqs**: Gestión de estado en URL (URL Search Params) para filtros compartibles.
*   **Vaul**: Drawers móviles nativos.

Para documentación completa, por favor mira el [Directorio de Documentación](./docs/README.md).

## ⚡ Inicio Rápido
1.  `npm install`
2.  `cp .env.example .env.local`
3.  `npm run dev`

## 📚 Documentación
*   [Información General y Arquitectura](./docs/README.md)
*   [Sistema de Componentes (shadcn/ui)](https://ui.shadcn.com)

## 🛠️ Herramientas Clave
*   **Biome**: Para linting y formateo. (Se recomienda la extensión de VS Code).
*   **Next.js App Router**: Para enrutamiento y estructura.
