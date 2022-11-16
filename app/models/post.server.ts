import type { Post, User } from "@prisma/client";
import { prisma } from "~/db.server";

export type { Post } from "@prisma/client";

export async function getPostsByPostSlug({ postsIds }: { postsIds: string[] }) {
  return Promise.all(
    postsIds.map((postId) =>
      prisma.post.findUnique({
        where: { slug: postId },
        select: { slug: true, title: true },
      })
    )
  );
}

export async function getPost(slug: string) {
  return prisma.post.findUnique({ where: { slug } });
}

export async function createPost({
  slug,
  title,
  markdown,
  file,
  creatorUserId,
}: Pick<Post, "slug" | "title" | "markdown" | "file"> & {
  creatorUserId: User["id"];
}) {
  return prisma.post.create({
    data: {
      title,
      slug,
      file,
      markdown,
      creatorUser: {
        connect: {
          id: creatorUserId,
        },
      },
    },
  });
}
