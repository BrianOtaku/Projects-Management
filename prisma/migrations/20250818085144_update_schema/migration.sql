/*
  Warnings:

  - A unique constraint covering the columns `[leaderId]` on the table `Team` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Team_leaderId_key" ON "public"."Team"("leaderId");
