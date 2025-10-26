import { Injectable, Scope } from '@nestjs/common';

/**
 * TenantContext - Almacena el contexto del tenant actual en el scope de la request
 * Se inyecta con scope REQUEST para que cada petición tenga su propio contexto
 */
@Injectable({ scope: Scope.REQUEST })
export class TenantContext {
    private tenantId: string | null = null;
    private schemaName: string | null = null;
    private companySlug: string | null = null;

    setTenant(tenantId: string, schemaName: string, companySlug: string): void {
        this.tenantId = tenantId;
        this.schemaName = schemaName;
        this.companySlug = companySlug;
    }

    getTenantId(): string | null {
        return this.tenantId;
    }

    getSchemaName(): string | null {
        return this.schemaName;
    }

    getCompanySlug(): string | null {
        return this.companySlug;
    }

    hasTenant(): boolean {
        return !!this.tenantId;
    }

    clear(): void {
        this.tenantId = null;
        this.schemaName = null;
        this.companySlug = null;
    }
}
