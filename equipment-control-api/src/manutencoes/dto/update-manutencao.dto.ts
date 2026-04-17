import { ApiPropertyOptional } from '@nestjs/swagger';
import { StatusManutencao } from '@prisma/client';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateManutencaoDto {
    @ApiPropertyOptional({
        example: 'Troca de rolamento, reaperto geral e revisão completa',
    })
    @IsOptional()
    @IsString()
    diagnostico?: string;

    @ApiPropertyOptional({ example: 'Joao da Silva' })
    @IsOptional()
    @IsString()
    responsavelManutencao?: string;

    @ApiPropertyOptional({
        enum: StatusManutencao,
        example: StatusManutencao.EM_MANUTENCAO,
    })
    @IsOptional()
    @IsEnum(StatusManutencao)
    statusManutencao?: StatusManutencao;

    @ApiPropertyOptional({ example: '2026-04-20' })
    @IsOptional()
    @IsDateString()
    dataInicio?: string;

    @ApiPropertyOptional({ example: '2026-04-25' })
    @IsOptional()
    @IsDateString()
    dataTermino?: string;
}
