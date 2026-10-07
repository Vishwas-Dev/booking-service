/*
  Warnings:

  - You are about to drop the column `idempotencyKeyId` on the `booking` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[bookingId]` on the table `idempotencyKey` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bookingId` to the `idempotencyKey` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `booking` DROP FOREIGN KEY `Booking_idempotencyKeyId_fkey`;

-- DropIndex
DROP INDEX `Booking_idempotencyKeyId_key` ON `booking`;

-- AlterTable
ALTER TABLE `booking` DROP COLUMN `idempotencyKeyId`;

-- AlterTable
ALTER TABLE `idempotencykey` ADD COLUMN `bookingId` INTEGER NOT NULL,
    ADD COLUMN `finalized` BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX `idempotencyKey_bookingId_key` ON `idempotencyKey`(`bookingId`);

-- AddForeignKey
ALTER TABLE `idempotencyKey` ADD CONSTRAINT `idempotencyKey_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `Booking`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
