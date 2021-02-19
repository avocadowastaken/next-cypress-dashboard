/*
  Warnings:

  - You are about to drop the column `result` on the `RunInstance` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RunInstance" DROP COLUMN "result",
ADD COLUMN     "error" JSONB,
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "totalPassed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalFailed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalPending" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalSkipped" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "TestResult" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "state" TEXT NOT NULL,
    "titleParts" TEXT[],
    "displayError" JSONB,
    "runInstanceId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TestResult" ADD FOREIGN KEY ("runInstanceId") REFERENCES "RunInstance"("id") ON DELETE CASCADE ON UPDATE CASCADE;
