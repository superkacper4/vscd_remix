import type { Commit, FilesOnCommits } from "@prisma/client";
import { connect } from "http2";
import { url } from "inspector";
import { prisma } from "~/db.server";

export async function getFilesOnCommits({ commitId }: { commitId: string }) {
  return prisma.filesOnCommits.findMany({
    where: { commitId },
    select: { fileId: true, commitId: true },
    // orderBy: { updatedAt: "desc" },
  });
}

export async function createFilesOnCommits({
  commitId,
  filesId,
}: {
  commitId: string;
  filesId: string[];
}) {
  console.log("filesOnCommits", commitId, filesId);
  return prisma.filesOnCommits.createMany({
    data: filesId.map((fileId) => ({
      commitId,
      fileId: fileId.id,
    })),
  });
}

//   data = [{
//     commitId,
//     fileId
//   }]
