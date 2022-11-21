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
  return prisma.filesOnCommits.createMany({
    data: filesId.map((fileId) => ({
      commitId,
      fileId: fileId,
    })),
  });
}

export const deleteFilesOnCommits = async ({
  commitsIds,
}: {
  commitsIds: string[];
}) => {
  await prisma.filesOnCommits.deleteMany({
    where: {
      commitId: {
        in: commitsIds,
      },
    },
  });
};
