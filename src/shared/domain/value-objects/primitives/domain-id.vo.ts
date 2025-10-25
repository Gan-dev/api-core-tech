import { randomUUID } from 'crypto';
import { DomainObject } from './DomainObject';

export class DomainId extends DomainObject {
    private readonly id: string;

    constructor(id: string) {
        super();
        this.id = id;
    }

    static create(): DomainId {
        return new DomainId(randomUUID());
    }

    static fromString(id: string): DomainId {
        // Validación básica de UUID
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            throw new Error('Invalid UUID format');
        }
        return new DomainId(id);
    }

    getValue(): string {
        return this.id;
    }

    equals(other: DomainId): boolean {
        return this.id === other.id;
    }

    toPrimitive(): string {
        return this.id;
    }
}