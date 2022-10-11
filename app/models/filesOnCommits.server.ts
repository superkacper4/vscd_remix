import type { FilesOnCommits } from "@prisma/client";
import { connect } from "http2";
import { url } from "inspector";
import { prisma } from "~/db.server";

export async function createFilesOnCommits({
  commitId,
  filesId,
}: {
  commitId: string;
  filesId: string[];
}) {
  return prisma.filesOnCommits.createMany({
    data: filesId.map((fileId) => ({
      commitId,
      fileId,
    })),
  });
}

//   data = [{
//     commitId,
//     fileId
//   }]
