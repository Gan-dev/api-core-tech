# 🏢 Arquitectura Multi-Tenant - Explicación Completa

## 🎯 **¿Por qué solo se sincroniza la tabla `companies`?**

Tu sistema está diseñado con **arquitectura multi-tenant con schemas separados**:

### Estructura de Base de Datos:

```
PostgreSQL Database: api_core_tech
│
├── 📁 Schema: public (GLOBAL)
│   ├── ✅ companies          ← Única tabla sincronizada
│   └── migrations_history
│
├── 📁 Schema: tenant_empresa1 (TENANT 1)
│   ├── clients
│   ├── staff
│   ├── brands
│   ├── devices
│   ├── repair_orders
│   └── notes
│
└── 📁 Schema: tenant_empresa2 (TENANT 2)
    ├── clients
    ├── staff
    └── ...
```

## 🔍 **Configuración Actual**

### `database.module.ts`:

```typescript
entities: [Company],  // Solo Company sincroniza
schema: 'public',     // Solo en schema público
```

**Resultado:** Solo se crea la tabla `companies` en el schema `public`.

## 📋 **Soluciones**

### **Opción 1: Modo Desarrollo (Todas en Public)**

Si quieres ver todas las tablas en un solo schema para desarrollo:

```typescript
// database.module.ts
entities: [
  Company,
  Client,
  Staff,
  Brand,
  Device,
  Note,
  RepairOrder
],
schema: 'public',
synchronize: true, // Solo desarrollo
```

✅ **Ventajas:**

- Fácil de debuggear
- Rápido setup

❌ **Desventajas:**

- No es multi-tenant real
- NO usar en producción

---

### **Opción 2: Multi-Tenant Real (Recomendado)**

Cada empresa tiene su propio schema aislado:

#### **1. Crear empresa (Company)**

```typescript
POST /tenancy/companies
{
  "name": "Empresa XYZ",
  "slug": "empresa-xyz",
  "taxId": "B12345678"
}
```

#### **2. Sistema crea automáticamente:**

```sql
-- En schema public
INSERT INTO companies (name, slug, schema_name, tax_id)
VALUES ('Empresa XYZ', 'empresa-xyz', 'tenant_empresa_xyz', 'B12345678');

-- Crear schema del tenant
CREATE SCHEMA tenant_empresa_xyz;

-- Crear tablas en el schema del tenant
CREATE TABLE tenant_empresa_xyz.clients (...);
CREATE TABLE tenant_empresa_xyz.staff (...);
CREATE TABLE tenant_empresa_xyz.brands (...);
-- etc...
```

#### **3. Acceso por Middleware**

```typescript
// Cada request identifica el tenant
GET /clients
Header: X-Tenant-Id: empresa-xyz

// Middleware cambia el search_path
SET search_path TO tenant_empresa_xyz;

// Query se ejecuta en schema del tenant
SELECT * FROM clients; // → tenant_empresa_xyz.clients
```

## 🚀 **Implementación Paso a Paso**

### **Paso 1: Actualizar database.module.ts**

Usa la `OPTION1` que creé para desarrollo:

```bash
# Renombrar archivo
mv src/database/database.module.ts src/database/database.module.OLD.ts
mv src/database/database.module.OPTION1.ts src/database/database.module.ts
```

### **Paso 2: Configurar .env**

```env
NODE_ENV=development
DB_SYNC=true  # Solo para desarrollo
```

### **Paso 3: Crear TenancyModule**

```typescript
// src/tenancy/tenancy.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenancyController } from './tenancy.controller';
import { TenancyService } from './tenancy.service';
import { TenantService } from './services/tenant.service';
import { Company } from './entities/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Company])],
  controllers: [TenancyController],
  providers: [TenancyService, TenantService],
  exports: [TenantService],
})
export class TenancyModule {}
```

### **Paso 4: Endpoint para crear tenant**

```typescript
// tenancy.controller.ts
@Post('companies')
async createCompany(@Body() dto: CreateCompanyDto) {
  // 1. Crear registro en tabla companies
  const company = await this.tenancyService.create(dto);

  // 2. Crear schema y tablas del tenant
  await this.tenantService.createTenantSchema(company.schemaName);

  return company;
}
```

## 📊 **Comparación de Opciones**

| Característica    | Opción 1 (Single Schema)               | Opción 2 (Multi-Tenant)          |
| ----------------- | -------------------------------------- | -------------------------------- |
| **Aislamiento**   | ❌ Todas las empresas comparten tablas | ✅ Schema separado por empresa   |
| **Seguridad**     | ⚠️ Baja (filtrar por company_id)       | ✅ Alta (aislamiento a nivel BD) |
| **Complejidad**   | ✅ Simple                              | ⚠️ Media                         |
| **Escalabilidad** | ⚠️ Limitada                            | ✅ Alta                          |
| **Backups**       | ❌ Todo o nada                         | ✅ Por empresa                   |
| **Desarrollo**    | ✅ Rápido                              | ⚠️ Requiere setup                |
| **Producción**    | ❌ No recomendado                      | ✅ Recomendado                   |

## 🛠️ **Comandos Útiles**

```bash
# Ver todos los schemas
psql -d api_core_tech -c "SELECT schema_name FROM information_schema.schemata WHERE schema_name LIKE 'tenant_%';"

# Ver tablas de un tenant
psql -d api_core_tech -c "\dt tenant_empresa_xyz.*"

# Cambiar a schema de tenant
psql -d api_core_tech -c "SET search_path TO tenant_empresa_xyz;"
```

## 🎓 **Recomendación**

Para **desarrollo inicial**:

- Usa **Opción 1** (todas las tablas en public)
- Es más fácil para probar y debuggear

Para **producción**:

- Implementa **Opción 2** (multi-tenant con schemas)
- Mejor aislamiento y seguridad
- Escalable a largo plazo

## 📝 **Siguiente Paso**

¿Qué prefieres?

1. **Simple (Opción 1)**: Te actualizo `database.module.ts` para sincronizar todas las tablas en `public`
2. **Completo (Opción 2)**: Implementamos el sistema multi-tenant completo con TenantService

Dime cuál necesitas y continúo! 🚀
