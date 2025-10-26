import { Injectable } from "@nestjs/common";

export abstract class DomainObject {
    abstract toPrimitive(): any;
}