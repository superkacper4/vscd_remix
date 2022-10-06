-- CreateTable
CREATE TABLE "Commit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "message" TEXT NOT NULL,
    "file" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "postSlug" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Commit_postSlug_fkey" FOREIGN KEY ("postSlug") REFERENCES "Post" ("slug") ON DELETE CASCADE ON UPDATE CASCADE
);
