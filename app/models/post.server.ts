import type { Post, User } from "@prisma/client";
import { prisma } from "~/db.server";

export type { Post } from "@prisma/client";

export async function getPostsByPostId({ postsIds }: { postsIds: string[] }) {
  return Promise.all(
    postsIds.map((postId) =>
      prisma.post.findUnique({
        where: { id: postId },
        select: { id: true, title: true, creatorUser: true },
      })
    )
  );
}

export async function getPost(id: string) {
  return prisma.post.findUnique({
    where: { id },
    select: {
      id: true,
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

export const getPostChildren = async ({ id }: { id: string }) => {
  return prisma.post.findMany({
    where: { parentId: id },

    select: {
      id: true,
      children: true,
      commits: {
        select: { id: true },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      // children: {
      //   include: {
      //     commits: true,
      //   },
      // },
    },
  });
};

export async function createPost({
  id,
  title,
  markdown,
  creatorUserId,
}: Pick<Post, "id" | "title" | "markdown"> & {
  creatorUserId: User["id"];
}) {
  return prisma.post.create({
    data: {
      title,
      id,
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
  id,
  parentId,
}: Pick<Post, "id" | "parentId">) => {
  return prisma.post.update({
    where: {
      id,
    },
    data: {
      // parentId,
      parent: {
        connect: {
          id: parentId,
        },
      },
    },
  });
};

export const deletePost = async ({ id }: { id: string }) => {
  return await prisma.post.delete({
    where: {
      id,
    },
    include: { commits: true },
  });
};
