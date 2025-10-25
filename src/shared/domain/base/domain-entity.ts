import { DomainId } from "../value-objects";

export abstract class DomainEntity {
    protected readonly id: string;
    protected readonly createdAt: Date;
    protected updatedAt: Date;

    constructor(id?: string) {
        this.id = id || DomainId.create().getValue();
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    getId(): string {
        return this.id;
    }

    getCreatedAt(): Date {
        return this.createdAt;
    }

    getUpdatedAt(): Date {
        return this.updatedAt;
    }

    protected updateTimestamp(): void {
        this.updatedAt = new Date();
    }

    abstract toPrimitive(): Record<string, any>;

    //TODO
    //abstract equals(other: DomainEntity): boolean;
}