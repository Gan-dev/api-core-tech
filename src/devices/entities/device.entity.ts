import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
    OneToMany,
} from 'typeorm';
import { Client } from '../../clients/entities';

/**
 * Device Entity - Representa un dispositivo del cliente
 * Almacena información del dispositivo que ingresa para reparación
 */
@Entity('devices')
export class Device {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid', name: 'client_id' })
    @Index()
    clientId: string;

    @ManyToOne(() => Client, { eager: true })
    @JoinColumn({ name: 'client_id' })
    client: Client;

    @Column({ type: 'varchar', length: 100, name: 'brand' })
    @Index()
    brand: string;

    @Column({ type: 'varchar', length: 100, name: 'model' })
    model: string;

    @Column({ type: 'varchar', length: 50, nullable: true, name: 'imei_entry' })
    @Index()
    imeiEntry: string; // IMEI al ingresar

    @Column({ type: 'varchar', length: 50, nullable: true, name: 'imei_exit' })
    imeiExit: string; // IMEI al salir (para detectar cambios)

    @Column({ type: 'varchar', length: 50, nullable: true, name: 'serial_number' })
    serialNumber: string;

    @Column({ type: 'text', nullable: true, name: 'device_password' })
    devicePassword: string; // Password del dispositivo (encriptado)

    @Column({ type: 'text', nullable: true, name: 'observations' })
    observations: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    // Relación con órdenes de reparación
    // @OneToMany(() => RepairOrder, order => order.device)
    // repairOrders: RepairOrder[];

    /**
     * Verifica si el IMEI cambió durante la reparación
     */
    hasImeiChanged(): boolean {
        return (
            !!this.imeiEntry &&
            !!this.imeiExit &&
            this.imeiEntry !== this.imeiExit
        );
    }

    /**
     * Obtiene el identificador del dispositivo
     */
    getDeviceIdentifier(): string {
        return `${this.brand} ${this.model}`;
    }
}
