/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[testId,runInstanceId]` on the table `TestResult`. If there are existing duplicate values, the migration will fail.
  - Added the required column `testId` to the `TestResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TestResult" ADD COLUMN     "testId" TEXT NOT NULL DEFAULT md5(random()::text);

-- CreateIndex
CREATE UNIQUE INDEX "TestResult.testId_runInstanceId_unique" ON "TestResult"("testId", "runInstanceId");
