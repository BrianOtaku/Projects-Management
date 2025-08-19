-- DropForeignKey
ALTER TABLE "public"."Team" DROP CONSTRAINT "Team_leaderId_fkey";

-- AlterTable
ALTER TABLE "public"."Team" ALTER COLUMN "leaderId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Team" ADD CONSTRAINT "Team_leaderId_fkey" FOREIGN KEY ("leaderId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
