/*
  Warnings:

  - You are about to drop the column `fileUrl` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the `TeamMember` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."TeamMember" DROP CONSTRAINT "TeamMember_projectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TeamMember" DROP CONSTRAINT "TeamMember_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Project" DROP COLUMN "fileUrl",
ALTER COLUMN "progress" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "teamId" BIGINT;

-- DropTable
DROP TABLE "public"."TeamMember";

-- CreateTable
CREATE TABLE "public"."Team" (
    "id" BIGSERIAL NOT NULL,
    "projectId" BIGINT NOT NULL,
    "teamName" TEXT NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Team_projectId_key" ON "public"."Team"("projectId");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Team" ADD CONSTRAINT "Team_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
