import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ManutencoesService } from './manutencoes.service';
import { CreateManutencaoSynchroDto } from './dto/create-manutencao-synchro.dto';
import { UpdateManutencaoDto } from './dto/update-manutencao.dto';
import { SynchroIntegrationGuard } from '../auth/synchro-integration.guard';

@ApiTags('Manutenções')
@Controller('manutencoes')
export class ManutencoesController {
    constructor(private readonly manutencoesService: ManutencoesService) {}

    @Post('synchro')
    @UseGuards(SynchroIntegrationGuard)
    @ApiHeader({
        name: 'x-integration-key',
        description: 'Chave de integração entre Synchro e Manutenção',
        required: true,
    })
    @ApiOperation({ summary: 'Criar manutenção automaticamente a partir do Synchro'})
    createfromSynchro(@Body() body: CreateManutencaoSynchroDto) {
        return this.manutencoesService.createFromSynchro(body);
    }

    @Get()
    @ApiOperation({ summary: 'Listar manutenções' })
    findAll() {
        return this.manutencoesService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Buscar manutenção por ID' })
    findOne(@Param('id') id: string) {
        return this.manutencoesService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Editar dados da manutenção' })
    update(@Param('id') id: string, @Body() body: UpdateManutencaoDto) {
        return this.manutencoesService.update(id, body);
    }

}