/*
  Warnings:

  - You are about to drop the column `amountRequested` on the `loanApplications` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "loanApplications" DROP COLUMN "amountRequested",
ALTER COLUMN "loanTenure" DROP NOT NULL;
