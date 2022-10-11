import type { Commit, Post, User } from "@prisma/client";
import { prisma } from "~/db.server";

export type { Post } from "@prisma/client";

export async function getCommits({ postSlug }: Pick<Commit, "postSlug">) {
  return prisma.commit.findMany({
    where: { postSlug },
    select: { message: true, id: true },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getCommit(id: string) {
  return prisma.commit.findUnique({ where: { id } });
}

export async function createCommit({
  postSlug,
  message,
  userId,
}: Pick<Commit, "message"> & {
  userId: User["id"];
} & {
  postSlug: Post["slug"];
}) {
  return prisma.commit.create({
    data: {
      message,
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
