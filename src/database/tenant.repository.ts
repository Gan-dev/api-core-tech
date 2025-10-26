import type { DataSource, EntityTarget, ObjectLiteral } from 'typeorm';
import { Repository } from 'typeorm';
import { Injectable, Scope, Inject } from '@nestjs/common';
import { TenantContext } from '../tenancy/tenant-context';
import { REQUEST } from '@nestjs/core';

/**
 * TenantRepository - Repository base que automáticamente usa el schema del tenant
 * Todas las queries se ejecutan en el schema del tenant actual
 */
@Injectable({ scope: Scope.REQUEST })
export class TenantRepository<T extends ObjectLiteral> extends Repository<T> {
    constructor(
        private readonly entityTarget: EntityTarget<T>,
        private readonly dataSource: DataSource,
        private readonly tenantContext: TenantContext,
        @Inject(REQUEST) private readonly request: any,
    ) {
        super(entityTarget, dataSource.manager);
        this.setupTenantContext();
    }

    /**
     * Configura el repository para usar el schema del tenant
     */
    private async setupTenantContext() {
        const schemaName = this.tenantContext.getSchemaName();

        if (schemaName) {
            // Configurar el repository para usar el schema del tenant
            const metadata = this.dataSource.getMetadata(this.entityTarget);
            metadata.schema = schemaName;
        }
    }

    /**
     * Ejecuta una query en el contexto del tenant
     */
    async executeInTenantSchema<R>(callback: () => Promise<R>): Promise<R> {
        const schemaName = this.tenantContext.getSchemaName();

        if (!schemaName) {
            throw new Error('Tenant context not set');
        }

        const queryRunner = this.dataSource.createQueryRunner();

        try {
            await queryRunner.connect();
            await queryRunner.query(`SET search_path TO "${schemaName}"`);

            const result = await callback();

            await queryRunner.query(`SET search_path TO public`);

            return result;
        } finally {
            await queryRunner.release();
        }
    }
}

/**
 * Factory para crear repositories con tenant context
 */
export function createTenantRepository<T extends ObjectLiteral>(
    entityTarget: EntityTarget<T>,
): any {
    @Injectable({ scope: Scope.REQUEST })
    class TenantRepositoryHost extends TenantRepository<T> {
        constructor(
            dataSource: DataSource,
            tenantContext: TenantContext,
            @Inject(REQUEST) request: any,
        ) {
            super(entityTarget, dataSource, tenantContext, request);
        }
    }

    return TenantRepositoryHost;
}
