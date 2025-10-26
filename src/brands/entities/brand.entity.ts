import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from 'typeorm';

/**
 * Brand Entity - Representa una marca de dispositivo
 * Cada tenant tiene su propio catálogo de marcas
 */
@Entity('brands')
export class Brand {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 150, unique: true, name: 'name' })
    @Index()
    name: string;

    @Column({ type: 'varchar', length: 255, nullable: true, name: 'logo' })
    logo: string; // URL o path del logo

    @Column({ type: 'boolean', default: true, name: 'is_active' })
    isActive: boolean;

    @Column({ type: 'text', nullable: true, name: 'description' })
    description: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
