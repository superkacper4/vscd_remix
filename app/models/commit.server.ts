import type { Commit, Post, User } from "@prisma/client";
import { prisma } from "~/db.server";

export type { Post } from "@prisma/client";

export async function getCommits({ postId }: Pick<Commit, "postId">) {
  return prisma.commit.findMany({
    where: { postId },
    // select: { message: true, id: true },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getCommitsIds({ postId }: Pick<Commit, "postId">) {
  return prisma.commit.findMany({
    where: { postId },
    select: { id: true },
  });
}

export async function getCommit(id: string) {
  return prisma.commit.findUnique({ where: { id } });
}

export const getPreviousCommit = async ({ postId }: Pick<Commit, "postId">) => {
  return prisma.commit.findMany({
    where: { postId },
    orderBy: { updatedAt: "desc" },
    take: 1,
  });
};

export async function createCommit({
  postId,
  message,
  userId,
  commitId,
  isTag,
}: Pick<Commit, "message" | "isTag"> & {
  userId: User["id"];
} & {
  postId: Post["id"];
} & {
  commitId: string;
}) {
  return prisma.commit.create({
    data: {
      id: commitId,
      message,
      isTag,
      post: {
        connect: {
          id: postId,
        },
      },
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export const deleteAllCommits = async ({ id }: { id: string }) => {
  await prisma.commit.deleteMany({
    where: {
      postId: {
        contains: id,
      },
    },
  });
};
