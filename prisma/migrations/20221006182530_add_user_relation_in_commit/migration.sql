-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Commit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "message" TEXT NOT NULL,
    "file" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "postSlug" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Commit_postSlug_fkey" FOREIGN KEY ("postSlug") REFERENCES "Post" ("slug") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Commit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Commit" ("createdAt", "file", "id", "message", "postSlug", "updatedAt", "userId") SELECT "createdAt", "file", "id", "message", "postSlug", "updatedAt", "userId" FROM "Commit";
DROP TABLE "Commit";
ALTER TABLE "new_Commit" RENAME TO "Commit";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
