import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
    BeforeInsert,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

export enum StaffRole {
    OWNER = 'OWNER', // Dueño de la empresa
    ADMIN = 'ADMIN', // Administrador
    MANAGER = 'MANAGER', // Gerente
    TECHNICIAN = 'TECHNICIAN', // Técnico
    RECEPTIONIST = 'RECEPTIONIST', // Recepcionista
    VIEWER = 'VIEWER', // Solo lectura
}

/**
 * Staff Entity - Representa un empleado/usuario del tenant
 * Cada usuario pertenece a un solo tenant y tiene roles específicos
 */
@Entity('staff')
export class Staff {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 128, name: 'name' })
    @Index()
    name: string;

    @Column({ type: 'varchar', length: 255, unique: true, name: 'email' })
    @Index()
    email: string;

    @Column({ type: 'varchar', length: 255, name: 'password' })
    password: string; // Hash de la contraseña

    @Column({
        type: 'enum',
        enum: StaffRole,
        default: StaffRole.VIEWER,
        name: 'role',
    })
    role: StaffRole;

    @Column({ type: 'varchar', length: 20, nullable: true, name: 'phone' })
    phone: string;

    @Column({ type: 'text', nullable: true, name: 'avatar' })
    avatar: string; // URL o base64 del avatar

    @Column({ type: 'boolean', default: true, name: 'is_active' })
    isActive: boolean;

    @Column({ type: 'timestamp', nullable: true, name: 'last_login' })
    lastLogin: Date;

    @Column({ type: 'jsonb', nullable: true, name: 'permissions' })
    permissions: Record<string, boolean>; // Permisos granulares adicionales

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true, name: 'deleted_at' })
    deletedAt: Date; // Soft delete

    @BeforeInsert()
    async hashPassword() {
        if (this.password) {
            this.password = await bcrypt.hash(this.password, 10);
        }
    }

    /**
     * Valida la contraseña del usuario
     */
    async validatePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }

    /**
     * Verifica si el usuario tiene un rol específico
     */
    hasRole(role: StaffRole): boolean {
        return this.role === role;
    }

    /**
     * Verifica si el usuario tiene permisos de administrador o superior
     */
    isAdminOrOwner(): boolean {
        return this.role === StaffRole.OWNER || this.role === StaffRole.ADMIN;
    }

    /**
     * Verifica si el usuario puede realizar reparaciones
     */
    canPerformRepairs(): boolean {
        return (
            this.role === StaffRole.TECHNICIAN ||
            this.role === StaffRole.MANAGER ||
            this.isAdminOrOwner()
        );
    }

    /**
     * Verifica si el usuario puede ver reportes financieros
     */
    canViewFinancialReports(): boolean {
        return (
            this.role === StaffRole.MANAGER ||
            this.role === StaffRole.ADMIN ||
            this.role === StaffRole.OWNER
        );
    }
}
