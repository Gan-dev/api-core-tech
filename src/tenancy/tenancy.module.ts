import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenancyService } from './tenancy.service';
import { TenancyController } from './tenancy.controller';
import { TenantContext } from './tenant-context';
import { TenantMiddleware } from './tenant.middleware';
import { Company } from './entities';

/**
 * TenancyModule - Módulo global para multi-tenancy
 * Proporciona el contexto del tenant a toda la aplicación
 */
@Global()
@Module({
    imports: [TypeOrmModule.forFeature([Company], 'default')],
    controllers: [TenancyController],
    providers: [TenancyService, TenantContext, TenantMiddleware],
    exports: [TenancyService, TenantContext, TenantMiddleware],
})
export class TenancyModule { }
