# Real Estate App

Aplicación de bienes raíces construida con Next.js 16, React 19, TypeScript y Tailwind CSS. Este proyecto incluye una biblioteca completa de componentes UI basados en shadcn/ui y Radix UI.

## Tabla de Contenidos

- [Requisitos Previos](#requisitos-previos)
- [Extensiones Requeridas](#extensiones-requeridas)
- [Instalación](#instalación)
- [Scripts Disponibles](#scripts-disponibles)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Stack Tecnológico](#stack-tecnológico)
- [Desarrollo](#desarrollo)
- [Despliegue](#despliegue)

## Requisitos Previos

- Node.js 20.x o superior
- npm (incluido con Node.js)
- (Opcional) [nvm](https://github.com/nvm-sh/nvm) o [nvm-windows](https://github.com/coreybutler/nvm-windows) para gestión de versiones de Node.js

**Nota importante**: Este proyecto utiliza **npm** como gestor de paquetes. Por favor, **NO uses yarn, pnpm o bun** para mantener la compatibilidad y evitar conflictos con `package-lock.json`.

## Extensiones Requeridas

### Biome (Obligatorio)

Este proyecto utiliza **Biome** como formateador y linter de código. Es **obligatorio** instalar y configurar la extensión de Biome en tu editor para mantener la consistencia del código.

#### Instalación en Visual Studio Code

1. Abre VS Code
2. Ve a Extensiones (Ctrl+Shift+X / Cmd+Shift+X)
3. Busca "Biome"
4. Instala la extensión oficial de Biomejs
   - [Biome - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=biomejs.biome)
   - ID de extensión: `biomejs.biome`

#### Configuración en Visual Studio Code

Después de instalar la extensión, debes configurarla como formateador por defecto:

**Opción 1: Configurar globalmente (recomendado para este proyecto)**

1. Abre la Paleta de Comandos (Ctrl+Shift+P / Cmd+Shift+P)
2. Busca "Preferences: Open User Settings (JSON)"
3. Agrega la siguiente configuración:

```json
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true,
  "[javascript]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[typescript]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[json]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[jsonc]": {
    "editor.defaultFormatter": "biomejs.biome"
  }
}
```

**Opción 2: Configurar mediante UI**

1. Abre un archivo TypeScript o JavaScript
2. Click derecho en el editor
3. Selecciona "Format Document With..."
4. Elige "Configure Default Formatter..."
5. Selecciona "Biome"
6. Habilita "Format On Save" en las configuraciones de VS Code

#### Configuración de Biome del Proyecto

El proyecto ya incluye la configuración de Biome en `biome.json` con:
- Formato automático con 2 espacios de indentación
- Linting habilitado con reglas recomendadas
- Soporte para Next.js y React
- Organización automática de imports

Una vez configurada correctamente, la extensión formateará automáticamente tu código al guardar archivos.

## Instalación

1. Clona el repositorio

2. (Opcional) Si usas nvm, el proyecto incluye un archivo `.nvmrc` que especifica la versión de Node.js requerida:

```bash
nvm use
# o si la versión no está instalada
nvm install
```

3. Instala las dependencias:

```bash
npm install
```

> **Importante**: Usa únicamente `npm install`. No uses otros gestores de paquetes como yarn, pnpm o bun.

## Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia el servidor de desarrollo en http://localhost:3000

# Producción
npm run build        # Construye la aplicación para producción
npm run start        # Inicia el servidor de producción

# Calidad de Código
npm run lint         # Ejecuta el linter (Biome check)
npm run format       # Formatea el código con Biome
```

## Estructura del Proyecto

```
realestate-app/
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── favicon.ico
│   │   ├── globals.css         # Estilos globales con Tailwind
│   │   ├── layout.tsx          # Layout raíz
│   │   └── page.tsx            # Página principal
│   │
│   ├── components/
│   │   └── ui/                 # Componentes UI reutilizables (shadcn/ui)
│   │
│   ├── hooks/                  # Custom React Hooks
│   │   └── use-mobile.ts       # Hook para detección de dispositivos móviles
│   │
│   └── lib/                    # Utilidades y helpers
│       └── utils.ts            # Funciones de utilidad (cn, etc.)
│
├── .nvmrc                      # Versión de Node.js requerida (20.x)
├── components.json             # Configuración de shadcn/ui
├── biome.json                  # Configuración de Biome
├── package.json
├── tsconfig.json               # Configuración de TypeScript
└── README.md
```

## Stack Tecnológico

### Core
- **Next.js 16.0.1** - Framework de React con App Router
- **React 19.2.0** - Biblioteca de UI
- **TypeScript 5** - Tipado estático
- **Tailwind CSS 4** - Framework de CSS utility-first

### UI Components
- **shadcn/ui** - Componentes UI accesibles y personalizables
- **Radix UI** - Primitivos de UI sin estilos
- **Lucide React** - Iconos

### Formularios y Validación
- **React Hook Form 7.65.0** - Gestión de formularios
- **Zod 4.1.12** - Validación de esquemas
- **@hookform/resolvers** - Resolvers para React Hook Form

### Utilidades
- **class-variance-authority** - Gestión de variantes de clases
- **clsx** & **tailwind-merge** - Utilidades para clases CSS
- **date-fns** - Manipulación de fechas
- **next-themes** - Gestión de temas (dark/light mode)

### Desarrollo
- **Biome 2.2.0** - Linter y formateador ultra-rápido
- **TypeScript** - Tipado estático

## Desarrollo

### Estructura de Componentes

Los componentes UI están organizados en `src/components/ui/` y siguen el patrón de shadcn/ui:

- Son componentes completamente personalizables
- Utilizan Radix UI como base
- Incluyen variantes mediante `class-variance-authority`
- Son accesibles por defecto (ARIA compliant)

### Estilos

El proyecto utiliza Tailwind CSS 4 con el preset `new-york` de shadcn/ui:

- Variables CSS para temas
- Modo oscuro soportado vía `next-themes`
- Color base: neutral
- Animaciones personalizadas con `tw-animate-css`

### Hooks Personalizados

- `use-mobile.ts`: Detecta si el usuario está en un dispositivo móvil

### Aliases de Importación

El proyecto está configurado con los siguientes aliases:

```typescript
@/components  →  src/components
@/lib         →  src/lib
@/hooks       →  src/hooks
@/ui          →  src/components/ui
```

## Despliegue

### Vercel (Recomendado)

La forma más sencilla de desplegar esta aplicación es usar [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Consulta la [documentación de despliegue de Next.js](https://nextjs.org/docs/app/building-your-application/deploying) para más detalles.

### Otros Proveedores

El proyecto puede desplegarse en cualquier plataforma que soporte Node.js:

1. Ejecuta `npm run build`
2. Ejecuta `npm run start`
3. La aplicación estará disponible en el puerto 3000

## Recursos Adicionales

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de shadcn/ui](https://ui.shadcn.com)
- [Documentación de Radix UI](https://www.radix-ui.com)
- [Documentación de Tailwind CSS](https://tailwindcss.com)
- [Documentación de Biome](https://biomejs.dev)
