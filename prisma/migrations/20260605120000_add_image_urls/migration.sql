-- AlterTable
ALTER TABLE "Update" ADD COLUMN "imageUrl" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Project" ADD COLUMN "imageUrl" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Thought" ADD COLUMN "imageUrl" TEXT NOT NULL DEFAULT '';
