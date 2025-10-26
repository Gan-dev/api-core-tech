import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * CreateTenantTables - Migración para crear todas las tablas en un schema de tenant
 * Esta migración se ejecuta cuando se crea un nuevo tenant
 */
export class CreateTenantTables1234567890123 implements MigrationInterface {
    name = 'CreateTenantTables1234567890123';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Esta migración se debe ejecutar con el schema_path configurado al schema del tenant

        // Tabla: clients
        await queryRunner.query(`
      CREATE TABLE "clients" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" varchar(128) NOT NULL,
        "firstSurname" varchar(128) NOT NULL,
        "secondSurname" varchar(128),
        "documentType" varchar(20) NOT NULL DEFAULT 'DNI',
        "document" varchar(16) NOT NULL,
        "address" varchar(255),
        "postalCode" varchar(10),
        "city" varchar(128),
        "province" varchar(128),
        "phone1" varchar(20) NOT NULL,
        "phone2" varchar(20),
        "email" varchar(255),
        "registrationDate" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "isActive" boolean NOT NULL DEFAULT true,
        "notes" text,
        CONSTRAINT "PK_clients" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_clients_document" UNIQUE ("document")
      )
    `);

        await queryRunner.query(`
      CREATE INDEX "IDX_clients_name" ON "clients" ("name")
    `);

        await queryRunner.query(`
      CREATE INDEX "IDX_clients_document" ON "clients" ("document")
    `);

        await queryRunner.query(`
      CREATE INDEX "IDX_clients_email" ON "clients" ("email")
    `);

        // Tabla: brands
        await queryRunner.query(`
      CREATE TABLE "brands" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" varchar(150) NOT NULL,
        "logo" varchar(255),
        "isActive" boolean NOT NULL DEFAULT true,
        "description" text,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_brands" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_brands_name" UNIQUE ("name")
      )
    `);

        await queryRunner.query(`
      CREATE INDEX "IDX_brands_name" ON "brands" ("name")
    `);

        // Tabla: devices
        await queryRunner.query(`
      CREATE TABLE "devices" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "clientId" uuid NOT NULL,
        "brand" varchar(100) NOT NULL,
        "model" varchar(100) NOT NULL,
        "imeiEntry" varchar(50),
        "imeiExit" varchar(50),
        "serialNumber" varchar(50),
        "devicePassword" text,
        "observations" text,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_devices" PRIMARY KEY ("id"),
        CONSTRAINT "FK_devices_client" FOREIGN KEY ("clientId") 
          REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE
      )
    `);

        await queryRunner.query(`
      CREATE INDEX "IDX_devices_clientId" ON "devices" ("clientId")
    `);

        await queryRunner.query(`
      CREATE INDEX "IDX_devices_brand" ON "devices" ("brand")
    `);

        await queryRunner.query(`
      CREATE INDEX "IDX_devices_imeiEntry" ON "devices" ("imeiEntry")
    `);

        // Tabla: staff
        await queryRunner.query(`
      CREATE TABLE "staff" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" varchar(128) NOT NULL,
        "email" varchar(255) NOT NULL,
        "password" varchar(255) NOT NULL,
        "role" varchar(50) NOT NULL DEFAULT 'VIEWER',
        "phone" varchar(20),
        "avatar" text,
        "isActive" boolean NOT NULL DEFAULT true,
        "lastLogin" TIMESTAMP,
        "permissions" jsonb,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP,
        CONSTRAINT "PK_staff" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_staff_email" UNIQUE ("email")
      )
    `);

        await queryRunner.query(`
      CREATE INDEX "IDX_staff_name" ON "staff" ("name")
    `);

        await queryRunner.query(`
      CREATE INDEX "IDX_staff_email" ON "staff" ("email")
    `);

        // Tabla: repair_orders
        await queryRunner.query(`
      CREATE TABLE "repair_orders" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "orderNumber" varchar(50) NOT NULL,
        "invoiceNumber" varchar(50),
        "clientId" uuid NOT NULL,
        "deviceId" uuid NOT NULL,
        "technicianId" uuid,
        "status" varchar(50) NOT NULL DEFAULT 'PENDING',
        "reportType" varchar(50) NOT NULL DEFAULT 'REPAIR',
        "reportedIssue" text NOT NULL,
        "technicalDiagnosis" text,
        "technicalObservations" text,
        "exitCondition" text,
        "warrantyType" varchar(50) NOT NULL DEFAULT 'NO_WARRANTY',
        "workItems" jsonb,
        "parts" jsonb,
        "accessories" jsonb,
        "subtotal" decimal(10,2) NOT NULL DEFAULT 0,
        "vatPercentage" decimal(5,2) NOT NULL DEFAULT 21,
        "vatAmount" decimal(10,2) NOT NULL DEFAULT 0,
        "total" decimal(10,2) NOT NULL DEFAULT 0,
        "paid" decimal(10,2) NOT NULL DEFAULT 0,
        "balance" decimal(10,2) NOT NULL DEFAULT 0,
        "entrySignature" text,
        "exitSignature" text,
        "entryDate" TIMESTAMP NOT NULL DEFAULT now(),
        "estimatedDeliveryDate" TIMESTAMP,
        "completionDate" TIMESTAMP,
        "deliveryDate" TIMESTAMP,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_repair_orders" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_repair_orders_orderNumber" UNIQUE ("orderNumber"),
        CONSTRAINT "FK_repair_orders_client" FOREIGN KEY ("clientId") 
          REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "FK_repair_orders_device" FOREIGN KEY ("deviceId") 
          REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "FK_repair_orders_technician" FOREIGN KEY ("technicianId") 
          REFERENCES "staff"("id") ON DELETE SET NULL ON UPDATE CASCADE
      )
    `);

        await queryRunner.query(`
      CREATE INDEX "IDX_repair_orders_orderNumber" ON "repair_orders" ("orderNumber")
    `);

        await queryRunner.query(`
      CREATE INDEX "IDX_repair_orders_invoiceNumber" ON "repair_orders" ("invoiceNumber")
    `);

        await queryRunner.query(`
      CREATE INDEX "IDX_repair_orders_clientId" ON "repair_orders" ("clientId")
    `);

        await queryRunner.query(`
      CREATE INDEX "IDX_repair_orders_deviceId" ON "repair_orders" ("deviceId")
    `);

        await queryRunner.query(`
      CREATE INDEX "IDX_repair_orders_technicianId" ON "repair_orders" ("technicianId")
    `);

        await queryRunner.query(`
      CREATE INDEX "IDX_repair_orders_status" ON "repair_orders" ("status")
    `);

        // Tabla: notes
        await queryRunner.query(`
      CREATE TABLE "notes" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "content" text NOT NULL,
        "type" varchar(50) NOT NULL DEFAULT 'GENERAL',
        "isActive" boolean NOT NULL DEFAULT true,
        "isPinned" boolean NOT NULL DEFAULT false,
        "authorId" uuid,
        "relatedOrderId" uuid,
        "reminderDate" TIMESTAMP,
        "color" varchar(50),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_notes" PRIMARY KEY ("id"),
        CONSTRAINT "FK_notes_author" FOREIGN KEY ("authorId") 
          REFERENCES "staff"("id") ON DELETE SET NULL ON UPDATE CASCADE
      )
    `);

        await queryRunner.query(`
      CREATE INDEX "IDX_notes_authorId" ON "notes" ("authorId")
    `);

        await queryRunner.query(`
      CREATE INDEX "IDX_notes_relatedOrderId" ON "notes" ("relatedOrderId")
    `);

        // Crear secuencia para numeración de órdenes
        await queryRunner.query(`
      CREATE SEQUENCE "repair_order_sequence" START WITH 1 INCREMENT BY 1;
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP SEQUENCE IF EXISTS "repair_order_sequence"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "notes" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "repair_orders" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "staff" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "devices" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "brands" CASCADE`);
        await queryRunner.query(`DROP TABLE IF EXISTS "clients" CASCADE`);
    }
}
