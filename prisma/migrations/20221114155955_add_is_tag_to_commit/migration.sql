/*
  Warnings:

  - Added the required column `isTag` to the `Commit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Commit" ADD COLUMN     "isTag" BOOLEAN NOT NULL;
