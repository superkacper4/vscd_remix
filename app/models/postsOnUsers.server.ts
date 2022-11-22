import type { User } from "@prisma/client";
import { redirect } from "@remix-run/server-runtime";
import { prisma } from "~/db.server";

export async function getPostsOnUsers({ userId }: { userId: User["id"] }) {
  return prisma.postsOnUsers.findMany({
    where: { userId },
  });
}

export async function getUsersOnPost({ postId }: { postId: string }) {
  return prisma.postsOnUsers.findMany({
    where: { postId },
  });
}
// migracja db i przekminić jak to dodawać nowych userów i jak wyświeltać wgl
export async function createPostsOnUsers({
  userId,
  postId,
}: {
  userId: string;
  postId: string;
}) {
  return prisma.postsOnUsers.create({
    data: {
      postId,
      userId,
    },
  });
}

export async function checkPostAccess({
  userId,
  postId,
}: {
  userId: string;
  postId: string;
}) {
  const postsOnUsers = await getPostsOnUsers({ userId });

  if (!postsOnUsers.some((post) => post.postId === postId))
    throw redirect(`/posts`);
}

export const deletePostOnUsers = async ({ id }: { id: string }) => {
  await prisma.postsOnUsers.deleteMany({
    where: {
      postId: {
        contains: id,
      },
    },
  });
};
