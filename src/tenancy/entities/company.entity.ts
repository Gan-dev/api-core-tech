import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from 'typeorm';

/**
 * Entidad Company - Representa una empresa/tenant en el sistema multi-tenant
 * Cada company tiene su propio schema en PostgreSQL para aislamiento total de datos
 */
@Entity('companies', { schema: 'public' })
export class Company {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 100, unique: true })
    @Index()
    name: string;

    @Column({ type: 'varchar', length: 100, unique: true, name: 'slug' })
    @Index()
    slug: string; // Para subdominio: slug.tuapp.com

    @Column({ type: 'varchar', length: 100, unique: true, name: 'schema_name' })
    @Index()
    schemaName: string; // Nombre del schema en PostgreSQL (ej: tenant_slug)

    @Column({ type: 'varchar', length: 255, nullable: true, name: 'domain' })
    domain: string; // Dominio propio opcional (ej: empresa.com)

    @Column({ type: 'varchar', length: 20, unique: true, name: 'tax_id' })
    taxId: string; // CIF/NIF de la empresa

    @Column({ type: 'varchar', length: 255, nullable: true, name: 'address' })
    address: string;

    @Column({ type: 'varchar', length: 100, nullable: true, name: 'city' })
    city: string;

    @Column({ type: 'varchar', length: 100, nullable: true, name: 'province' })
    province: string;

    @Column({ type: 'varchar', length: 10, nullable: true, name: 'postal_code' })
    postalCode: string;

    @Column({ type: 'varchar', length: 20, nullable: true, name: 'phone' })
    phone: string;

    @Column({ type: 'varchar', length: 255, nullable: true, name: 'email' })
    email: string;

    @Column({ type: 'text', nullable: true, name: 'logo' })
    logo: string; // URL o base64 del logo

    @Column({ type: 'boolean', default: true, name: 'is_active' })
    isActive: boolean;

    @Column({ type: 'varchar', length: 50, default: 'repair_shop', name: 'industry_type' })
    industryType: string; // Tipo de negocio: repair_shop, workshop, service_center, etc.

    @Column({ type: 'jsonb', nullable: true, name: 'settings' })
    settings: Record<string, any>; // Configuraciones específicas por empresa

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true, name: 'suspended_at' })
    suspendedAt: Date | null;

    @Column({ type: 'timestamp', nullable: true, name: 'deleted_at' })
    deletedAt: Date | null; // Soft delete
}
