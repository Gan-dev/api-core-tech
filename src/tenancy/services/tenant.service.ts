import { Injectable, Scope } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';

/**
 * TenantService - Gestiona conexiones dinámicas a schemas de tenant
 * 
 * Este servicio maneja:
 * 1. Creación de schemas para nuevos tenants
 * 2. Acceso dinámico a datos de tenant específico
 * 3. Sincronización de tablas en schemas de tenant
 */
@Injectable({ scope: Scope.REQUEST })
export class TenantService {
    private tenantSchema: string | null = null;

    constructor(
        @InjectDataSource() private readonly dataSource: DataSource,
    ) { }

    /**
     * Establece el schema del tenant actual
     */
    setTenantSchema(schemaName: string): void {
        this.tenantSchema = schemaName;
    }

    /**
     * Obtiene el schema del tenant actual
     */
    getTenantSchema(): string {
        if (!this.tenantSchema) {
            throw new Error('Tenant schema not set. Use TenantMiddleware or set manually.');
        }
        return this.tenantSchema;
    }

    /**
     * Crea un nuevo schema para un tenant y sincroniza las tablas
     */
    async createTenantSchema(schemaName: string): Promise<void> {
        const queryRunner = this.dataSource.createQueryRunner();

        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();

            // 1. Crear el schema
            await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);

            // 2. Obtener entidades que deben ir en el tenant (todas excepto Company)
            const entities = this.dataSource.entityMetadatas
                .filter(meta => meta.tableName !== 'companies')
                .map(meta => meta.target);

            // 3. Crear conexión temporal para sincronizar
            const tenantDataSource = new DataSource({
                type: 'postgres',
                host: this.dataSource.options['host'] as string,
                port: this.dataSource.options['port'] as number,
                username: this.dataSource.options['username'] as string,
                password: this.dataSource.options['password'] as string,
                database: this.dataSource.options['database'] as string,
                schema: schemaName,
                entities: entities,
                synchronize: true, // Solo para crear tablas
            });

            await tenantDataSource.initialize();
            await tenantDataSource.synchronize();
            await tenantDataSource.destroy();

            await queryRunner.commitTransaction();

            console.log(`✅ Tenant schema "${schemaName}" created successfully`);
        } catch (error) {
            await queryRunner.rollbackTransaction();
            console.error(`❌ Error creating tenant schema "${schemaName}":`, error);
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    /**
     * Elimina el schema de un tenant (usar con precaución)
     */
    async dropTenantSchema(schemaName: string): Promise<void> {
        if (schemaName === 'public') {
            throw new Error('Cannot drop public schema');
        }

        await this.dataSource.query(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`);
        console.log(`🗑️ Tenant schema "${schemaName}" dropped`);
    }

    /**
     * Obtiene un EntityManager para el schema del tenant actual
     */
    getTenantEntityManager(): EntityManager {
        const schema = this.getTenantSchema();

        // Crear query runner con el schema del tenant
        const queryRunner = this.dataSource.createQueryRunner();
        queryRunner.query(`SET search_path TO "${schema}"`);

        return queryRunner.manager;
    }

    /**
     * Lista todos los schemas de tenant
     */
    async listTenantSchemas(): Promise<string[]> {
        const result = await this.dataSource.query(`
            SELECT schema_name 
            FROM information_schema.schemata 
            WHERE schema_name LIKE 'tenant_%'
            ORDER BY schema_name
        `);

        return result.map((row: any) => row.schema_name);
    }

    /**
     * Verifica si un schema existe
     */
    async schemaExists(schemaName: string): Promise<boolean> {
        const result = await this.dataSource.query(
            `SELECT EXISTS(
                SELECT 1 FROM information_schema.schemata 
                WHERE schema_name = $1
            )`,
            [schemaName]
        );

        return result[0].exists;
    }
}
