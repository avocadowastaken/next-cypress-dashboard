-- AlterEnum
ALTER TYPE "TestResultState" ADD VALUE 'skipped';

-- AlterTable
ALTER TABLE "RunInstance" ALTER COLUMN "error" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "TestResult" ALTER COLUMN "displayError" SET DATA TYPE TEXT;
