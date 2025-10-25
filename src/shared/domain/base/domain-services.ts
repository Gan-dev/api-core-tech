import { Injectable } from '@nestjs/common';
import { DomainEntity } from './domain-entity';

@Injectable()
export abstract class DomainService<T extends DomainEntity, CreateDto, UpdateDto> {

    abstract create(createDto: CreateDto): Promise<T>;
    abstract findAll(): Promise<T[]>;
    abstract findById(id: string): Promise<T | null>;
    abstract update(id: string, updateDto: UpdateDto): Promise<T | null>;
    abstract delete(id: string): Promise<boolean>;

    // Métodos utilitarios del dominio
    protected validateDomainId(id: string): void {
        if (!id) {
            throw new Error('Domain ID is required');
        }
    }

    protected logDomainOperation(operation: string, entityType: string, id?: string): void {
        console.log(`[${entityType}DomainService] ${operation}${id ? ` - ID: ${id}` : ''}`);
    }
}