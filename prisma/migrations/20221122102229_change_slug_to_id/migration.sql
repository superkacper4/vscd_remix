/*
  Warnings:

  - You are about to drop the column `postSlug` on the `Commit` table. All the data in the column will be lost.
  - The primary key for the `Post` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `slug` on the `Post` table. All the data in the column will be lost.
  - The primary key for the `PostsOnUsers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `postSlug` on the `PostsOnUsers` table. All the data in the column will be lost.
  - Added the required column `postId` to the `Commit` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Post` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `postId` to the `PostsOnUsers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Commit" DROP CONSTRAINT "Commit_postSlug_fkey";

-- DropForeignKey
ALTER TABLE "FilesOnCommits" DROP CONSTRAINT "FilesOnCommits_commitId_fkey";

-- DropForeignKey
ALTER TABLE "FilesOnCommits" DROP CONSTRAINT "FilesOnCommits_fileId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_parentId_fkey";

-- DropForeignKey
ALTER TABLE "PostsOnUsers" DROP CONSTRAINT "PostsOnUsers_postSlug_fkey";

-- DropForeignKey
ALTER TABLE "PostsOnUsers" DROP CONSTRAINT "PostsOnUsers_userId_fkey";

-- AlterTable
ALTER TABLE "Commit" DROP COLUMN "postSlug",
ADD COLUMN     "postId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Post" DROP CONSTRAINT "Post_pkey",
DROP COLUMN "slug",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Post_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "PostsOnUsers" DROP CONSTRAINT "PostsOnUsers_pkey",
DROP COLUMN "postSlug",
ADD COLUMN     "postId" TEXT NOT NULL,
ADD CONSTRAINT "PostsOnUsers_pkey" PRIMARY KEY ("postId", "userId");

-- AddForeignKey
ALTER TABLE "Commit" ADD CONSTRAINT "Commit_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FilesOnCommits" ADD CONSTRAINT "FilesOnCommits_commitId_fkey" FOREIGN KEY ("commitId") REFERENCES "Commit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FilesOnCommits" ADD CONSTRAINT "FilesOnCommits_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostsOnUsers" ADD CONSTRAINT "PostsOnUsers_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostsOnUsers" ADD CONSTRAINT "PostsOnUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
