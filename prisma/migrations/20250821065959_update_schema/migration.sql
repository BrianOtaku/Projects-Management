-- AlterTable
ALTER TABLE "public"."Project" ADD COLUMN     "accept" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canceled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "completeAt" TIMESTAMP(3),
ADD COLUMN     "submit" BOOLEAN NOT NULL DEFAULT false;
