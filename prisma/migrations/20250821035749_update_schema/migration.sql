/*
  Warnings:

  - You are about to drop the column `reviewedByLeader` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Task" DROP COLUMN "reviewedByLeader",
ADD COLUMN     "accept" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "submit" BOOLEAN NOT NULL DEFAULT false;
