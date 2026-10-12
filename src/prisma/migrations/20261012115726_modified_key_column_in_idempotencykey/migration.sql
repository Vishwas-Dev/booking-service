/*
  Warnings:

  - You are about to drop the column `key` on the `idempotencykey` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[idemKey]` on the table `idempotencyKey` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `idemKey` to the `idempotencyKey` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `idempotencyKey_key_key` ON `idempotencykey`;

-- AlterTable
ALTER TABLE `idempotencykey` DROP COLUMN `key`,
    ADD COLUMN `idemKey` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `idempotencyKey_idemKey_key` ON `idempotencyKey`(`idemKey`);
