-- CreateTable
CREATE TABLE "RegistroInspecaoMontagem" (
    "id" TEXT NOT NULL,
    "equipmentId" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL,
    "valorObservado" TEXT,
    "instrumentoMedicao" TEXT,
    "conformidades" BOOLEAN,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RegistroInspecaoMontagem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RegistroInspecaoMontagem_equipmentId_ordem_key" ON "RegistroInspecaoMontagem"("equipmentId", "ordem");

-- AddForeignKey
ALTER TABLE "RegistroInspecaoMontagem" ADD CONSTRAINT "RegistroInspecaoMontagem_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
