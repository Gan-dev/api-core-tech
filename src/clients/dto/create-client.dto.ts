import { IsString, IsEmail, IsOptional, Length, IsEnum } from 'class-validator';

export enum DocumentType {
    DNI = 'DNI',
    NIE = 'NIE',
    CIF = 'CIF',
    PASSPORT = 'PASSPORT',
}

export class CreateClientDto {
    @IsString()
    @Length(1, 128)
    name: string;

    @IsString()
    @Length(1, 128)
    firstSurname: string;

    @IsOptional()
    @IsString()
    @Length(0, 128)
    secondSurname?: string;

    @IsEnum(DocumentType)
    documentType: DocumentType;

    @IsString()
    @Length(5, 16)
    document: string;

    @IsOptional()
    @IsString()
    @Length(0, 255)
    address?: string;

    @IsOptional()
    @IsString()
    @Length(0, 10)
    postalCode?: string;

    @IsOptional()
    @IsString()
    @Length(0, 128)
    city?: string;

    @IsOptional()
    @IsString()
    @Length(0, 128)
    province?: string;

    @IsString()
    @Length(9, 20)
    phone1: string;

    @IsOptional()
    @IsString()
    @Length(0, 20)
    phone2?: string;

    @IsOptional()
    @IsEmail()
    email?: string;
}
