import type { Commit, Post, User } from "@prisma/client";
import { prisma } from "~/db.server";

export type { Post } from "@prisma/client";

export async function getCommits({ postSlug }: Pick<Commit, "postSlug">) {
  return prisma.commit.findMany({
    where: { postSlug },
    // select: { message: true, id: true },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getCommit(id: string) {
  return prisma.commit.findUnique({ where: { id } });
}

export const getPreviousCommit = async ({
  postSlug,
}: Pick<Commit, "postSlug">) => {
  return prisma.commit.findMany({
    where: { postSlug },
    orderBy: { updatedAt: "desc" },
    take: 1,
  });
};

export async function createCommit({
  postSlug,
  message,
  userId,
  commitId,
  isTag,
}: Pick<Commit, "message" | "isTag"> & {
  userId: User["id"];
} & {
  postSlug: Post["slug"];
} & {
  commitId: string;
}) {
  console.log("isTag", isTag);
  return prisma.commit.create({
    data: {
      id: commitId,
      message,
      isTag,
      post: {
        connect: {
          slug: postSlug,
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
