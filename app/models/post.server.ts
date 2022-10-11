import type { Post, User } from "@prisma/client";
import { prisma } from "~/db.server";

export type { Post } from "@prisma/client";

export async function getPosts({ userId }: { userId: User["id"] }) {
  return prisma.post.findMany({
    where: { userId },
    select: { slug: true, title: true },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getPost(slug: string) {
  return prisma.post.findUnique({ where: { slug } });
}

export async function createPost({
  slug,
  title,
  markdown,
  file,
  userId,
}: Pick<Post, "slug" | "title" | "markdown" | "file"> & {
  userId: User["id"];
}) {
  return prisma.post.create({
    data: {
      title,
      slug,
      file,
      markdown,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}
