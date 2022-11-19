/*
  Warnings:

  - You are about to drop the column `file` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "file",
ADD COLUMN     "parentId" TEXT;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Post"("slug") ON DELETE SET NULL ON UPDATE CASCADE;
