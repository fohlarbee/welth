/*
  Warnings:

  - The values [rejected,approved] on the enum `LoanStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `submittedAt` on the `loanApplications` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "LoanStatus_new" AS ENUM ('pending', 'Ready');
ALTER TABLE "loanApplications" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "loanApplications" ALTER COLUMN "status" TYPE "LoanStatus_new" USING ("status"::text::"LoanStatus_new");
ALTER TYPE "LoanStatus" RENAME TO "LoanStatus_old";
ALTER TYPE "LoanStatus_new" RENAME TO "LoanStatus";
DROP TYPE "LoanStatus_old";
ALTER TABLE "loanApplications" ALTER COLUMN "status" SET DEFAULT 'pending';
COMMIT;

-- AlterTable
ALTER TABLE "loanApplications" DROP COLUMN "submittedAt",
ADD COLUMN     "creditScore" DOUBLE PRECISION,
ADD COLUMN     "evaluatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "netIncome" DOUBLE PRECISION,
ADD COLUMN     "recommendedLoanAmount" DOUBLE PRECISION;
