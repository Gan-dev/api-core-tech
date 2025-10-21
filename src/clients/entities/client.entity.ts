import { DomainEntity, FullName } from '../../shared/domain';
import { DomainId } from '../../shared/domain/value-objects/DomainId';

export type ClientPrimitiveData = {
    id: string;
    name: string;
    lastName: string;

}

export type ClientDomainModel = {
    id: string;
    fullName: FullName;
}

export class Client extends DomainEntity {
    constructor(
        id: DomainId,
        private readonly fullName: FullName,

    ) {
        super(id.getValue());
    }

    fromPrimitive(primitive: ClientPrimitiveData): Client {
        const fullName = FullName.create(primitive.name, primitive.lastName);
        return new Client(DomainId.fromString(primitive.id), fullName);
    }

    toPrimitive(): ClientPrimitiveData {
        return {
            id: this.id,
            name: this.fullName.getName(),
            lastName: this.fullName.getLastName(),
        };
    }


    static create(name: string, lastName: string): Client {
        const fullName = FullName.create(name, lastName);
        return new Client(DomainId.create(), fullName);
    }

    getFullName(): FullName {
        return this.fullName;
    }

    getName(): string {
        return this.fullName.getName();
    }

    getLastName(): string {
        return this.fullName.getLastName();
    }


}