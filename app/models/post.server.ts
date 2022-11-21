import type { Post, User } from "@prisma/client";
import { prisma } from "~/db.server";

export type { Post } from "@prisma/client";

export async function getPostsByPostSlug({ postsIds }: { postsIds: string[] }) {
  return Promise.all(
    postsIds.map((postId) =>
      prisma.post.findUnique({
        where: { slug: postId },
        select: { slug: true, title: true, creatorUser: true },
      })
    )
  );
}

export async function getPost(slug: string) {
  return prisma.post.findUnique({
    where: { slug },
    select: {
      slug: true,
      title: true,
      markdown: true,
      parentId: true,
      parent: true,
      children: true,
      commits: true,
      creatorUserId: true,
      createdAt: true,
    },
  });
}

export async function createPost({
  slug,
  title,
  markdown,
  creatorUserId,
}: Pick<Post, "slug" | "title" | "markdown"> & {
  creatorUserId: User["id"];
}) {
  return prisma.post.create({
    data: {
      title,
      slug,
      markdown,
      creatorUser: {
        connect: {
          id: creatorUserId,
        },
      },
    },
  });
}

export const addParent = async ({
  slug,
  parentId,
}: Pick<Post, "slug" | "parentId">) => {
  return prisma.post.update({
    where: {
      slug,
    },
    data: {
      // parentId,
      parent: {
        connect: {
          slug: parentId,
        },
      },
    },
  });
};

export const deletePost = async ({ slug }: { slug: string }) => {
  return await prisma.post.delete({
    where: {
      slug,
    },
    include: { commits: true },
  });
};
