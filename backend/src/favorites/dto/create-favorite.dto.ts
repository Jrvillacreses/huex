import { IsString, IsOptional } from 'class-validator';

export class CreateFavoriteDto {
    @IsString()
    hex: string;

    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    rgb: string;

    @IsOptional()
    @IsString()
    cmyk: string;

    @IsOptional()
    @IsString()
    lab: string;
}
