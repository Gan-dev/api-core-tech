# Sistema Multi-Tenant de Gestión de Reparaciones

Sistema modular y escalable para gestión de talleres de reparación con arquitectura multi-tenant basada en schemas de PostgreSQL.

## 🏗️ Arquitectura Multi-Tenant

### Estrategia: Schema Separation

Cada empresa (tenant) tiene su propio schema en PostgreSQL, proporcionando:
- ✅ **Aislamiento total** de datos entre empresas
- ✅ **Escalabilidad** horizontal y vertical
- ✅ **Seguridad** mejorada
- ✅ **Customización** independiente por empresa
- ✅ **Backups** selectivos por empresa

### Identificación de Tenants

El sistema identifica el tenant de dos formas:

1. **Subdominio**: `empresa1.tuapp.com`
2. **Dominio propio**: `empresa.com`

El `TenantMiddleware` extrae automáticamente el tenant del host y configura el contexto para toda la request.

## 📁 Estructura del Proyecto

```
src/
├── tenancy/              # Módulo de multi-tenancy
│   ├── entities/
│   │   └── company.entity.ts    # Entidad Company (tenant)
│   ├── dto/
│   ├── tenant-context.ts        # Contexto del tenant por request
│   ├── tenant.middleware.ts     # Middleware de identificación
│   ├── tenancy.service.ts       # Lógica de gestión de tenants
│   └── tenancy.module.ts
├── database/
│   ├── database.module.ts       # Configuración PostgreSQL
│   └── tenant.repository.ts     # Repository base con tenant context
├── clients/              # Módulo de clientes
│   └── entities/
│       └── client.entity.ts     # Entidad Cliente
├── devices/              # Módulo de dispositivos
│   └── entities/
│       └── device.entity.ts     # Entidad Dispositivo
├── brands/               # Módulo de marcas (catálogo por tenant)
│   └── entities/
│       └── brand.entity.ts      # Entidad Marca
├── staff/                # Módulo de personal/usuarios
│   └── entities/
│       └── staff.entity.ts      # Entidad Staff con roles
├── reports/              # Módulo de órdenes de reparación
│   └── entities/
│       └── repair-order.entity.ts  # Entidad RepairOrder
└── notes/                # Módulo de notas
    └── entities/
        └── note.entity.ts       # Entidad Note
```

## 🗄️ Esquema de Base de Datos

### Schema Público (`public`)
Contiene datos globales del sistema:
- `companies` - Información de todos los tenants

### Schemas de Tenant (`tenant_{slug}`)
Cada tenant tiene su propio schema con:
- `clients` - Clientes del tenant
- `devices` - Dispositivos
- `brands` - Catálogo de marcas personalizado
- `staff` - Empleados y usuarios del tenant
- `repair_orders` - Órdenes de reparación/informes
- `notes` - Notas y recordatorios

## 🚀 Configuración Inicial

### 1. Variables de Entorno

Crear archivo `.env`:

```env
# Database
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=repair_system
DB_SYNCHRONIZE=false  # ⚠️ Siempre false en producción
DB_LOGGING=true

# Application
APP_PORT=3000
NODE_ENV=development
```

### 2. Instalar Dependencias

```bash
pnpm install
```

### 3. Crear Base de Datos

```sql
CREATE DATABASE repair_system;
```

### 4. Ejecutar Migraciones

```bash
# Crear migración
pnpm typeorm migration:generate -n InitialSchema

# Ejecutar migraciones
pnpm typeorm migration:run
```

## 📝 Uso del Sistema

### Crear una Nueva Empresa (Tenant)

```bash
POST /tenancy/companies
Content-Type: application/json

{
  "name": "Reparaciones TechPro",
  "slug": "techpro",
  "taxId": "B12345678",
  "email": "info@techpro.com",
  "phone": "912345678",
  "industryType": "repair_shop"
}
```

Esto automáticamente:
1. Crea el registro en la tabla `companies`
2. Crea el schema `tenant_techpro` en PostgreSQL
3. El tenant es accesible en `techpro.tuapp.com`

### Acceder como Tenant

Todas las requests deben incluir el tenant en el host:

```bash
# Opción 1: Subdominio
GET https://techpro.tuapp.com/api/clients

# Opción 2: Dominio propio (si está configurado)
GET https://empresa.com/api/clients
```

El middleware identifica automáticamente el tenant y:
- Carga el contexto del tenant
- Configura el schema correcto
- Todas las queries se ejecutan en el schema del tenant

## 👥 Sistema de Roles

### Roles Disponibles

1. **OWNER** - Dueño de la empresa
   - Acceso total al sistema
   - Gestión de empleados y configuración

2. **ADMIN** - Administrador
   - Acceso a casi todas las funciones
   - No puede eliminar la empresa

3. **MANAGER** - Gerente
   - Visualización de reportes financieros
   - Gestión de órdenes y clientes

4. **TECHNICIAN** - Técnico
   - Crear y actualizar órdenes de reparación
   - Diagnósticos y trabajos técnicos

5. **RECEPTIONIST** - Recepcionista
   - Crear clientes y órdenes
   - Consultar estado de órdenes

6. **VIEWER** - Solo lectura
   - Visualización sin permisos de edición

## 🔐 Seguridad

### Aislamiento de Datos
- Cada tenant opera en su propio schema
- Los datos nunca se mezclan entre tenants
- Imposible acceder a datos de otro tenant

### Autenticación
- Contraseñas hasheadas con bcrypt
- Sistema de roles granular
- Permisos adicionales en formato JSON

### Mejores Prácticas
1. Nunca usar `synchronize: true` en producción
2. Siempre validar el tenant en cada request
3. Usar transacciones para operaciones críticas
4. Implementar rate limiting por tenant

## 📊 Entidades Principales

### Client (Cliente)
```typescript
{
  id: uuid,
  name: string,
  firstSurname: string,
  secondSurname?: string,
  documentType: enum,
  document: string,
  phone1: string,
  email?: string,
  // ... más campos
}
```

### Device (Dispositivo)
```typescript
{
  id: uuid,
  clientId: uuid,
  brand: string,
  model: string,
  imeiEntry?: string,
  imeiExit?: string,
  // ... más campos
}
```

### RepairOrder (Orden de Reparación)
```typescript
{
  id: uuid,
  orderNumber: string,
  clientId: uuid,
  deviceId: uuid,
  status: enum,
  reportedIssue: string,
  technicalDiagnosis?: string,
  workItems: json,
  parts: json,
  subtotal: decimal,
  total: decimal,
  // ... más campos
}
```

### Staff (Personal)
```typescript
{
  id: uuid,
  name: string,
  email: string,
  password: string (hashed),
  role: enum,
  permissions?: json,
  // ... más campos
}
```

## 🔄 Flujo de una Orden de Reparación

1. **PENDING** - Cliente trae dispositivo
2. **IN_DIAGNOSIS** - Técnico revisa
3. **QUOTE_SENT** - Se envía presupuesto
4. **APPROVED** - Cliente aprueba
5. **IN_REPAIR** - En reparación
6. **COMPLETED** - Reparación terminada
7. **DELIVERED** - Entregado al cliente

## 📈 Escalabilidad

### Horizontal
- Añadir más instancias de la aplicación
- Load balancer distribuye el tráfico
- Cada instancia accede al mismo PostgreSQL

### Vertical
- PostgreSQL soporta miles de schemas
- Índices por tenant para rendimiento óptimo
- Connection pooling configurado

### Por Tenant
- Cada tenant puede tener configuraciones únicas
- Catálogos independientes (marcas, servicios)
- Numeración de órdenes independiente

## 🛠️ Comandos Útiles

```bash
# Desarrollo
pnpm start:dev

# Producción
pnpm build
pnpm start:prod

# Tests
pnpm test

# Linting
pnpm lint

# Migraciones
pnpm typeorm migration:generate -n MigrationName
pnpm typeorm migration:run
pnpm typeorm migration:revert
```

## 📚 Próximos Pasos

1. [ ] Implementar autenticación JWT
2. [ ] Crear sistema de migraciones por tenant
3. [ ] Implementar webhooks para eventos
4. [ ] Dashboard de métricas por tenant
5. [ ] Sistema de facturación automatizado
6. [ ] API de reportes y analytics
7. [ ] Notificaciones por email/SMS
8. [ ] Integración con pasarelas de pago

## 🤝 Contribución

Este proyecto sigue principios de:
- **DDD** (Domain-Driven Design)
- **SOLID** principles
- **Clean Architecture**
- **Multi-tenancy** best practices

---

**Desarrollado con ❤️ usando NestJS + TypeORM + PostgreSQL**
