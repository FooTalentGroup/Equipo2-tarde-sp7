# Tests Unitarios - Backend

## 📁 Estructura

```
backend/
├── src/                    ← Código fuente
│   ├── domain/
│   ├── presentation/
│   └── ...
└── tests/                  ← Tests centralizados
    └── unit/
        ├── domain/
        │   ├── errors/
        │   │   └── custom.error.spec.ts
        │   ├── entities/
        │   │   └── client.entity.spec.ts
        │   └── utils/
        │       └── phone-normalization.util.spec.ts
        └── presentation/
            └── ...
```

## 🚀 Comandos

### Ejecutar todos los tests
```bash
npm test
```

### Modo watch (re-ejecuta al guardar)
```bash
npm run test:watch
```

### Ver coverage
```bash
npm run test:coverage
```

## 📝 Escribir Tests

### Imports con alias `@/`
```typescript
// ✅ Correcto
import { CustomError } from '@/domain/errors/custom.error';
import { ClientEntity } from '@/domain/entities/client.entity';

// ❌ Incorrecto (no usar rutas relativas)
import { CustomError } from '../../../src/domain/errors/custom.error';
```

### Ejemplo de test
```typescript
import { CustomError } from '@/domain/errors/custom.error';

describe('CustomError', () => {
  it('should create a 400 error', () => {
    const error = CustomError.badRequest('Invalid input');
    
    expect(error.message).toBe('Invalid input');
    expect(error.statusCode).toBe(400);
  });
});
```

## ⚠️ Importante

- ✅ Tests se ejecutan **SOLO localmente** con `npm test`
- ✅ **NO se ejecutan** en el deploy de Render
- ✅ Script `build` sin cambios
- ✅ Código en `src/`, tests en `tests/`

## 📊 Coverage

El reporte de coverage se genera en `coverage/lcov-report/index.html`

```bash
npm run test:coverage
# Abrir coverage/lcov-report/index.html en el navegador
```
