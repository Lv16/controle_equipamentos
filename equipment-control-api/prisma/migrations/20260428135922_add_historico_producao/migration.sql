-- CreateTable
CREATE TABLE "HistoricoProducao" (
    "id" TEXT NOT NULL,
    "equipmentId" TEXT NOT NULL,
    "campo" TEXT NOT NULL,
    "valorAnterior" TEXT,
    "valorNovo" TEXT,
    "alteradoPor" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HistoricoProducao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HistoricoProducao_equipmentId_idx" ON "HistoricoProducao"("equipmentId");

-- AddForeignKey
ALTER TABLE "HistoricoProducao" ADD CONSTRAINT "HistoricoProducao_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
