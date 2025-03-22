/*
  Warnings:

  - The `status` column on the `Candidate` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `changeType` on the `CandidateHistory` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "CandidateStatus" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "ChangeType" AS ENUM ('CREATE', 'UPDATE', 'DELETE');

-- AlterTable
ALTER TABLE "Candidate" DROP COLUMN "status",
ADD COLUMN     "status" "CandidateStatus" NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "CandidateHistory" DROP COLUMN "changeType",
ADD COLUMN     "changeType" "ChangeType" NOT NULL;
