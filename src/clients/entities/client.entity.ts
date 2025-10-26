import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    Index,
} from 'typeorm';

export enum DocumentType {
    DNI = 'DNI',
    NIE = 'NIE',
    CIF = 'CIF',
    PASSPORT = 'PASSPORT',
}

/**
 * Client Entity - Representa un cliente en el sistema
 * Cada tenant tiene su propia tabla de clientes en su schema
 */
@Entity('clients')
export class Client {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 128, name: 'name' })
    @Index()
    name: string;

    @Column({ type: 'varchar', length: 128, name: 'first_surname' })
    firstSurname: string;

    @Column({ type: 'varchar', length: 128, nullable: true, name: 'second_surname' })
    secondSurname: string;

    @Column({
        type: 'enum',
        enum: DocumentType,
        default: DocumentType.DNI,
        name: 'document_type',
    })
    documentType: DocumentType;

    @Column({ type: 'varchar', length: 16, unique: true, name: 'document' })
    document: string;

    @Column({ type: 'varchar', length: 255, nullable: true, name: 'address' })
    address: string;

    @Column({ type: 'varchar', length: 10, nullable: true, name: 'postal_code' })
    postalCode: string;

    @Column({ type: 'varchar', length: 128, nullable: true, name: 'city' })
    city: string;

    @Column({ type: 'varchar', length: 128, nullable: true, name: 'province' })
    province: string;

    @Column({ type: 'varchar', length: 20, name: 'phone1' })
    phone1: string;

    @Column({ type: 'varchar', length: 20, nullable: true, name: 'phone2' })
    phone2: string;

    @Column({ type: 'varchar', length: 255, nullable: true, name: 'email' })
    @Index()
    email: string;

    @CreateDateColumn({ name: 'registration_date' })
    registrationDate: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @Column({ type: 'boolean', default: true, name: 'is_active' })
    isActive: boolean;

    @Column({ type: 'text', nullable: true, name: 'notes' })
    notes: string;

    // Relación con dispositivos (se definirá en Device entity)
    // @OneToMany(() => Device, device => device.client)
    // devices: Device[];

    /**
     * Obtiene el nombre completo del cliente
     */
    getFullName(): string {
        const parts = [this.name, this.firstSurname, this.secondSurname].filter(
            Boolean,
        );
        return parts.join(' ');
    }

    /**
     * Obtiene el teléfono principal o secundario
     */
    getContactPhone(): string {
        return this.phone1 || this.phone2;
    }
}