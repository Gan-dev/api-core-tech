export abstract class BaseEntity {
    constructor(public readonly id: string) {
        this.validateId(id);
    }

    equals(other: BaseEntity): boolean {
        return this.id === other.id;
    }

    abstract toPrimitive(): Record<string, any>;
    abstract fromPrimitive(primitive: Record<string, any>): void;

    private validateId(id: string): void {
        if (!id || id.trim().length === 0) {
            throw new Error('Entity ID cannot be empty');
        }
    }
}