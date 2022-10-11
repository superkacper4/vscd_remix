/*
  Warnings:

  - You are about to drop the column `file` on the `Commit` table. All the data in the column will be lost.
  - You are about to drop the column `commitId` on the `File` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Commit" DROP COLUMN "file";

-- AlterTable
ALTER TABLE "File" DROP COLUMN "commitId";
