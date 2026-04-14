/*
  Warnings:

  - A unique constraint covering the columns `[tag]` on the table `Equipment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Equipment" ADD COLUMN     "tag" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Equipment_tag_key" ON "Equipment"("tag");
