import {
    Injectable,
    NestMiddleware,
    UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantContext } from './tenant-context';
import { TenancyService } from './tenancy.service';

/**
 * TenantMiddleware - Middleware que identifica el tenant desde el dominio/subdominio
 * Extrae el slug del tenant y configura el contexto para toda la request
 */
@Injectable()
export class TenantMiddleware implements NestMiddleware {
    constructor(
        private readonly tenantContext: TenantContext,
        private readonly tenancyService: TenancyService,
    ) { }

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            // Extraer el tenant del host
            const host = req.get('host') || req.hostname;
            const tenant = await this.extractTenantFromHost(host);

            if (!tenant) {
                throw new UnauthorizedException('Tenant not found or invalid domain');
            }

            // Configurar el contexto del tenant
            this.tenantContext.setTenant(tenant.id, tenant.schemaName, tenant.slug);

            next();
        } catch (error) {
            throw new UnauthorizedException(
                `Unable to identify tenant: ${error.message}`,
            );
        }
    }

    /**
     * Extrae el tenant basado en el host de la request
     * Soporta:
     * - Subdominios: empresa1.tuapp.com -> empresa1
     * - Dominios propios: empresa.com -> busca por domain
     */
    private async extractTenantFromHost(host: string) {
        // Remover puerto si existe
        const cleanHost = host.split(':')[0];

        // Intentar buscar por dominio propio primero
        let tenant = await this.tenancyService.findByDomain(cleanHost);

        if (!tenant) {
            // Extraer subdominio
            const parts = cleanHost.split('.');

            // Si tiene al menos 2 partes (subdominio.dominio.tld)
            if (parts.length >= 2) {
                const slug = parts[0];
                tenant = await this.tenancyService.findBySlug(slug);
            }
        }

        return tenant;
    }
}
