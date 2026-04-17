-- CreateEnum
CREATE TYPE "OrigemManutencao" AS ENUM ('SYNCHRO', 'MANUAL');

-- CreateEnum
CREATE TYPE "StatusManutencao" AS ENUM ('PENDENTE', 'EM_MANUTENCAO', 'CONCLUIDA');

-- CreateTable
CREATE TABLE "Manutencao" (
    "id" TEXT NOT NULL,
    "origem" "OrigemManutencao" NOT NULL DEFAULT 'SYNCHRO',
    "tipoEquipamentoNome" TEXT,
    "modeloEquipamento" TEXT,
    "numeroSerie" TEXT,
    "tag" TEXT,
    "situacaoEquipamento" TEXT,
    "dataRetornoBase" TIMESTAMP(3),
    "dataInicio" TIMESTAMP(3),
    "dataTermino" TIMESTAMP(3),
    "statusManutencao" "StatusManutencao" NOT NULL DEFAULT 'PENDENTE',
    "diagnostico" TEXT,
    "responsavelManutencao" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Manutencao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Manutencao_numeroSerie_idx" ON "Manutencao"("numeroSerie");

-- CreateIndex
CREATE INDEX "Manutencao_tag_idx" ON "Manutencao"("tag");
