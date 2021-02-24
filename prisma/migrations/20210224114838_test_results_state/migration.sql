/*
  Warnings:

  - You are about to alter the column `state` on the `TestResult` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Enum("TestResultState")`.

*/
-- CreateEnum
CREATE TYPE "TestResultState" AS ENUM ('passed', 'failed');

-- AlterTable
ALTER TABLE "TestResult" ALTER COLUMN "state" SET DATA TYPE "TestResultState",
ALTER COLUMN "testId" DROP DEFAULT;
