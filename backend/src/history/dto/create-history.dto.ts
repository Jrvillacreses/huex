import { IsString, IsOptional } from 'class-validator';

export class CreateHistoryDto {
    @IsString()
    hex: string;

    @IsOptional()
    @IsString()
    rgb?: string;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    cmyk?: string;

    @IsOptional()
    @IsString()
    lab?: string;
}
