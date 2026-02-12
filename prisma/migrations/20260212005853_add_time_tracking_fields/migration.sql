-- AlterTable
ALTER TABLE "Order" ADD COLUMN "actualReadyAt" DATETIME;
ALTER TABLE "Order" ADD COLUMN "estimatedReadyAt" DATETIME;
ALTER TABLE "Order" ADD COLUMN "ovenEnteredAt" DATETIME;
