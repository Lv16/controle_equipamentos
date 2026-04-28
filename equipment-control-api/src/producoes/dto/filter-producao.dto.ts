import { ApiPropertyOptional } from '@nestjs/swagger';
import { StatusProducao } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { PaginationProducaoDto } from './pagination-producao.dto';

export class FilterProducaoDto extends PaginationProducaoDto {
    @ApiPropertyOptional({ example:1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    numeroOrdem?: number;

    @ApiPropertyOptional({ example: 'CSEX420ACM-1'})
    @IsOptional()
    @IsString()
    numeroSerie?: string;

    @ApiPropertyOptional({example: 'CSEX420ACM'})
    @IsOptional()
    @IsString()
    modelo?: string;

    @ApiPropertyOptional({example: 'TAG-0001'})
    @IsOptional()
    @IsString()
    tag?: string;

    @ApiPropertyOptional({
        enum: StatusProducao,
        example: StatusProducao.PROGRAMADA,
    })
    @IsOptional()
    @IsEnum(StatusProducao)
    statusProducao?: StatusProducao;

    @ApiPropertyOptional({ example: 'uuid-do-tipo-equipamento' })
    @IsOptional()
    @IsString()
    tipoEquipamentoId?: string;
}

