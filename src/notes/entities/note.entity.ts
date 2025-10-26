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
import { Staff } from '../../staff/entities';

export enum NoteType {
    GENERAL = 'GENERAL',
    REMINDER = 'REMINDER',
    IMPORTANT = 'IMPORTANT',
    TODO = 'TODO',
}

/**
 * Note Entity - Representa notas/recordatorios del sistema
 * Puede ser notas generales del tenant o asociadas a una orden específica
 */
@Entity('notes')
export class Note {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text', name: 'content' })
    content: string;

    @Column({
        type: 'enum',
        enum: NoteType,
        default: NoteType.GENERAL,
        name: 'type',
    })
    type: NoteType;

    @Column({ type: 'boolean', default: true, name: 'is_active' })
    isActive: boolean;

    @Column({ type: 'boolean', default: false, name: 'is_pinned' })
    isPinned: boolean; // Para destacar notas importantes

    @Column({ type: 'uuid', nullable: true, name: 'author_id' })
    @Index()
    authorId: string;

    @ManyToOne(() => Staff, { nullable: true })
    @JoinColumn({ name: 'author_id' })
    author: Staff;

    @Column({ type: 'uuid', nullable: true, name: 'related_order_id' })
    @Index()
    relatedOrderId: string; // ID de la orden relacionada (si aplica)

    @Column({ type: 'timestamp', nullable: true, name: 'reminder_date' })
    reminderDate: Date; // Fecha de recordatorio

    @Column({ type: 'varchar', length: 50, nullable: true, name: 'color' })
    color: string; // Color de la nota para UI

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    /**
     * Verifica si la nota es un recordatorio activo
     */
    isActiveReminder(): boolean {
        return (
            this.type === NoteType.REMINDER &&
            this.isActive &&
            this.reminderDate &&
            this.reminderDate > new Date()
        );
    }

    /**
     * Marca la nota como completada (para TODOs)
     */
    markAsCompleted(): void {
        this.isActive = false;
    }
}
