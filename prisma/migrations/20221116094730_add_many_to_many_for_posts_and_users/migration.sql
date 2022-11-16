-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_userId_fkey";

-- CreateTable
CREATE TABLE "PostsOnUsers" (
    "postSlug" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "PostsOnUsers_pkey" PRIMARY KEY ("postSlug","userId")
);

-- AddForeignKey
ALTER TABLE "PostsOnUsers" ADD CONSTRAINT "PostsOnUsers_postSlug_fkey" FOREIGN KEY ("postSlug") REFERENCES "Post"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostsOnUsers" ADD CONSTRAINT "PostsOnUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
