export interface FullNamePrimitive {
    name: string;
    lastName: string;
}

export class FullName {
    constructor(
        private readonly name: string,
        private readonly lastName: string,
    ) {
        this.validateName(name);
        this.validateLastName(lastName);
    }

    static fromPrimitive(primitive: FullNamePrimitive): FullName {
        return new FullName(primitive.name, primitive.lastName);
    }

    static create(name: string, lastName: string): FullName {
        return new FullName(name, lastName);
    }

    getName(): string {
        return this.name;
    }

    getLastName(): string {
        return this.lastName;
    }

    getFullName(): string {
        return `${this.name} ${this.lastName}`;
    }

    toPrimitive(): FullNamePrimitive {
        return {
            name: this.name,
            lastName: this.lastName,
        };
    }

    equals(other: FullName): boolean {
        return (
            this.name === other.name &&
            this.lastName === other.lastName
        );
    }

    toString(): string {
        return this.getFullName();
    }

    private validateName(name: string): void {
        if (!name || name.trim().length === 0) {
            throw new Error('Name cannot be empty');
        }
        if (name.trim().length < 2) {
            throw new Error('Name must have at least 2 characters');
        }
        if (name.trim().length > 50) {
            throw new Error('Name cannot exceed 50 characters');
        }
    }

    private validateLastName(lastName: string): void {
        if (!lastName || lastName.trim().length === 0) {
            throw new Error('Last name cannot be empty');
        }
        if (lastName.trim().length < 2) {
            throw new Error('Last name must have at least 2 characters');
        }
        if (lastName.trim().length > 50) {
            throw new Error('Last name cannot exceed 50 characters');
        }
    }
}