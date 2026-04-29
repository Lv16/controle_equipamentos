-- AlterTable
ALTER TABLE "Equipment" ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "excluidoEm" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Manutencao" ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "excluidoEm" TIMESTAMP(3);
