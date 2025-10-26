import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Company } from './entities';
import { CreateCompanyDto, UpdateCompanyDto } from './dto';

/**
 * TenancyService - Gestiona las empresas/tenants del sistema
 * Responsable de crear, actualizar y buscar tenants
 */
@Injectable()
export class TenancyService {
    constructor(
        @InjectRepository(Company, 'default')
        private readonly companyRepository: Repository<Company>,
        private readonly dataSource: DataSource,
    ) { }

    /**
     * Busca una company por su slug (subdominio)
     */
    async findBySlug(slug: string): Promise<Company | null> {
        return this.companyRepository.findOne({
            where: { slug, isActive: true },
        });
    }

    /**
     * Busca una company por su dominio propio
     */
    async findByDomain(domain: string): Promise<Company | null> {
        return this.companyRepository.findOne({
            where: { domain, isActive: true },
        });
    }

    /**
     * Busca una company por su ID
     */
    async findById(id: string): Promise<Company> {
        const company = await this.companyRepository.findOne({ where: { id } });

        if (!company) {
            throw new NotFoundException(`Company with ID ${id} not found`);
        }

        return company;
    }

    /**
     * Obtiene todas las companies
     */
    async findAll(): Promise<Company[]> {
        return this.companyRepository.find({
            where: { isActive: true },
            order: { createdAt: 'DESC' },
        });
    }

    /**
     * Crea una nueva company y su schema en PostgreSQL
     */
    async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
        // Generar el nombre del schema
        const schemaName = `tenant_${createCompanyDto.slug}`;

        // Crear la entidad company
        const company = this.companyRepository.create({
            ...createCompanyDto,
            schemaName,
        });

        // Guardar en el schema público
        const savedCompany = await this.companyRepository.save(company);

        // Crear el schema para el tenant
        await this.createTenantSchema(schemaName);

        return savedCompany;
    }

    /**
     * Actualiza una company existente
     */
    async update(id: string, updateCompanyDto: UpdateCompanyDto): Promise<Company> {
        const company = await this.findById(id);

        // No permitir cambiar el slug una vez creado (cambiaría el schema)
        const { slug, ...updateData } = updateCompanyDto;

        Object.assign(company, updateData);

        return this.companyRepository.save(company);
    }

    /**
     * Suspende una company (soft suspend)
     */
    async suspend(id: string): Promise<Company> {
        const company = await this.findById(id);
        company.isActive = false;
        company.suspendedAt = new Date();
        return this.companyRepository.save(company);
    }

    /**
     * Reactiva una company suspendida
     */
    async reactivate(id: string): Promise<Company> {
        const company = await this.findById(id);
        company.isActive = true;
        company.suspendedAt = null;
        return this.companyRepository.save(company);
    }

    /**
     * Elimina una company (soft delete)
     */
    async remove(id: string): Promise<void> {
        const company = await this.findById(id);
        company.deletedAt = new Date();
        company.isActive = false;
        await this.companyRepository.save(company);
    }

    /**
     * Crea el schema de PostgreSQL para un tenant
     * Incluye la creación de todas las tablas necesarias
     */
    private async createTenantSchema(schemaName: string): Promise<void> {
        const queryRunner = this.dataSource.createQueryRunner();

        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();

            // Crear el schema
            await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);

            // Aquí se crearán las tablas específicas del tenant
            // Por ahora solo creamos el schema, las migraciones crearán las tablas

            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    /**
     * Ejecuta una query en el schema de un tenant específico
     */
    async executeInTenantContext<T>(
        schemaName: string,
        callback: () => Promise<T>,
    ): Promise<T> {
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
