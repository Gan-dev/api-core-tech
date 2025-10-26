import { IsString, IsEmail, IsOptional, IsBoolean, Length, Matches } from 'class-validator';

export class CreateCompanyDto {
    @IsString()
    @Length(2, 100)
    name: string;

    @IsString()
    @Length(2, 100)
    @Matches(/^[a-z0-9-]+$/, {
        message: 'slug must contain only lowercase letters, numbers, and hyphens',
    })
    slug: string;

    @IsString()
    @Length(5, 20)
    taxId: string;

    @IsOptional()
    @IsString()
    @Length(0, 255)
    address?: string;

    @IsOptional()
    @IsString()
    city?: string;

    @IsOptional()
    @IsString()
    province?: string;

    @IsOptional()
    @IsString()
    postalCode?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    logo?: string;

    @IsOptional()
    @IsString()
    domain?: string;

    @IsOptional()
    @IsString()
    industryType?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
