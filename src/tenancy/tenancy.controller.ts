import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
} from '@nestjs/common';
import { TenancyService } from './tenancy.service';
import { CreateCompanyDto, UpdateCompanyDto } from './dto';

/**
 * TenancyController - Endpoints para gestión de companies/tenants
 * Estos endpoints deberían estar protegidos para admin super-users
 */
@Controller('tenancy/companies')
// @UseGuards(SuperAdminGuard) // Descomentar cuando tengas autenticación
export class TenancyController {
    constructor(private readonly tenancyService: TenancyService) { }

    @Post()
    create(@Body() createCompanyDto: CreateCompanyDto) {
        return this.tenancyService.create(createCompanyDto);
    }

    @Get()
    findAll() {
        return this.tenancyService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.tenancyService.findById(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
        return this.tenancyService.update(id, updateCompanyDto);
    }

    @Patch(':id/suspend')
    suspend(@Param('id') id: string) {
        return this.tenancyService.suspend(id);
    }

    @Patch(':id/reactivate')
    reactivate(@Param('id') id: string) {
        return this.tenancyService.reactivate(id);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.tenancyService.remove(id);
    }
}
