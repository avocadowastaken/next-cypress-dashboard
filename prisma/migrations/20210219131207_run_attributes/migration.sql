/*
  Warnings:

  - You are about to drop the column `commit` on the `Run` table. All the data in the column will be lost.
  - You are about to drop the column `platform` on the `Run` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "OS" AS ENUM ('unknown', 'darwin', 'linux', 'windows');

-- CreateEnum
CREATE TYPE "Browser" AS ENUM ('unknown', 'chrome', 'chromium', 'edge', 'electron', 'firefox');

-- AlterTable
ALTER TABLE "Run" DROP COLUMN "commit",
DROP COLUMN "platform",
ADD COLUMN     "commitSha" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "commitBranch" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "commitMessage" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "commitAuthorName" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "commitAuthorEmail" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "os" "OS" NOT NULL DEFAULT E'unknown',
ADD COLUMN     "osVersion" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "browser" "Browser" NOT NULL DEFAULT E'unknown',
ADD COLUMN     "browserVersion" TEXT NOT NULL DEFAULT E'';
