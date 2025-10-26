import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { Client } from '../../clients/entities';
import { Device } from '../../devices/entities';
import { Staff } from '../../staff/entities';

export enum RepairOrderStatus {
    PENDING = 'PENDING', // Pendiente de revisión
    IN_DIAGNOSIS = 'IN_DIAGNOSIS', // En diagnóstico
    QUOTE_SENT = 'QUOTE_SENT', // Presupuesto enviado
    APPROVED = 'APPROVED', // Aprobado para reparación
    IN_REPAIR = 'IN_REPAIR', // En reparación
    WAITING_PARTS = 'WAITING_PARTS', // Esperando repuestos
    COMPLETED = 'COMPLETED', // Reparación completada
    DELIVERED = 'DELIVERED', // Entregado al cliente
    CANCELLED = 'CANCELLED', // Cancelado
    WARRANTY = 'WARRANTY', // En garantía
}

export enum WarrantyType {
    NO_WARRANTY = 'NO_WARRANTY',
    MANUFACTURER = 'MANUFACTURER', // Garantía del fabricante
    STORE = 'STORE', // Garantía de la tienda
    REPAIR = 'REPAIR', // Garantía de reparación
}

export enum ReportType {
    REPAIR = 'REPAIR',
    DIAGNOSIS = 'DIAGNOSIS',
    QUOTE = 'QUOTE',
    WARRANTY_CLAIM = 'WARRANTY_CLAIM',
}

/**
 * RepairOrder Entity - Representa una orden de reparación/informe
 * Documento principal del sistema que registra todo el ciclo de vida de una reparación
 */
@Entity('repair_orders')
export class RepairOrder {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 50, unique: true, name: 'order_number' })
    orderNumber: string; // Número de orden único por tenant

    @Column({ type: 'varchar', length: 50, nullable: true, name: 'invoice_number' })
    @Index()
    invoiceNumber: string; // Número de factura

    @Column({ type: 'uuid', name: 'client_id' })
    @Index()
    clientId: string;

    @ManyToOne(() => Client, { eager: true })
    @JoinColumn({ name: 'client_id' })
    client: Client;

    @Column({ type: 'uuid', name: 'device_id' })
    @Index()
    deviceId: string;

    @ManyToOne(() => Device, { eager: true })
    @JoinColumn({ name: 'device_id' })
    device: Device;

    @Column({ type: 'uuid', nullable: true, name: 'technician_id' })
    @Index()
    technicianId: string;

    @ManyToOne(() => Staff, { nullable: true })
    @JoinColumn({ name: 'technician_id' })
    technician: Staff;

    @Column({
        type: 'enum',
        enum: RepairOrderStatus,
        default: RepairOrderStatus.PENDING,
        name: 'status',
    })
    @Index()
    status: RepairOrderStatus;

    @Column({
        type: 'enum',
        enum: ReportType,
        default: ReportType.REPAIR,
        name: 'report_type',
    })
    reportType: ReportType;

    // Información de la avería
    @Column({ type: 'text', name: 'reported_issue' })
    reportedIssue: string; // Avería reportada por el cliente

    @Column({ type: 'text', nullable: true, name: 'technical_diagnosis' })
    technicalDiagnosis: string; // Diagnóstico del técnico

    @Column({ type: 'text', nullable: true, name: 'technical_observations' })
    technicalObservations: string; // Observaciones técnicas

    @Column({ type: 'text', nullable: true, name: 'exit_condition' })
    exitCondition: string; // Condiciones de salida

    // Garantía
    @Column({
        type: 'enum',
        enum: WarrantyType,
        default: WarrantyType.NO_WARRANTY,
        name: 'warranty_type',
    })
    warrantyType: WarrantyType;

    // Trabajos y repuestos realizados (JSON para flexibilidad)
    @Column({ type: 'jsonb', nullable: true, name: 'work_items' })
    workItems: WorkItem[]; // Array de trabajos realizados

    @Column({ type: 'jsonb', nullable: true, name: 'parts' })
    parts: PartItem[]; // Array de repuestos utilizados

    // Accesorios entregados con el dispositivo
    @Column({ type: 'jsonb', nullable: true, name: 'accessories' })
    accessories: AccessoryItem[];

    // Costos
    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, name: 'subtotal' })
    subtotal: number;

    @Column({ type: 'decimal', precision: 5, scale: 2, default: 21, name: 'vat_percentage' })
    vatPercentage: number; // % IVA

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, name: 'vat_amount' })
    vatAmount: number; // Cantidad de IVA

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, name: 'total' })
    total: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, name: 'paid' })
    paid: number; // Cantidad pagada

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, name: 'balance' })
    balance: number; // Saldo pendiente

    // Firmas
    @Column({ type: 'text', nullable: true, name: 'entry_signature' })
    entrySignature: string; // Firma al entregar el dispositivo (base64)

    @Column({ type: 'text', nullable: true, name: 'exit_signature' })
    exitSignature: string; // Firma al recoger el dispositivo (base64)

    // Fechas importantes
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'entry_date' })
    entryDate: Date; // Fecha de ingreso

    @Column({ type: 'timestamp', nullable: true, name: 'estimated_delivery_date' })
    estimatedDeliveryDate: Date; // Fecha estimada de entrega

    @Column({ type: 'timestamp', nullable: true, name: 'completion_date' })
    completionDate: Date; // Fecha de finalización de reparación

    @Column({ type: 'timestamp', nullable: true, name: 'delivery_date' })
    deliveryDate: Date; // Fecha de entrega al cliente

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    /**
     * Calcula el total con IVA
     */
    calculateTotal(): void {
        this.vatAmount = (this.subtotal * this.vatPercentage) / 100;
        this.total = this.subtotal + this.vatAmount;
        this.balance = this.total - this.paid;
    }

    /**
     * Verifica si la orden está completada
     */
    isCompleted(): boolean {
        return this.status === RepairOrderStatus.COMPLETED;
    }

    /**
     * Verifica si la orden está entregada
     */
    isDelivered(): boolean {
        return this.status === RepairOrderStatus.DELIVERED;
    }

    /**
     * Verifica si el pago está completo
     */
    isFullyPaid(): boolean {
        return this.balance <= 0;
    }

    /**
     * Marca la orden como entregada
     */
    markAsDelivered(): void {
        this.status = RepairOrderStatus.DELIVERED;
        this.deliveryDate = new Date();
    }
}

/**
 * Interfaces para los items JSON
 */
export interface WorkItem {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

export interface PartItem {
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

export interface AccessoryItem {
    name: string; // ej: "Tapa", "Batería", "Cargador", "Tarjeta memoria"
    included: boolean;
}
