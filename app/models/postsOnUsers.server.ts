import type { User } from "@prisma/client";
import { redirect } from "@remix-run/server-runtime";
import { prisma } from "~/db.server";

export async function getPostsOnUsers({ userId }: { userId: User["id"] }) {
  return prisma.postsOnUsers.findMany({
    where: { userId },
  });
}

export async function getUsersOnPost({ postSlug }: { postSlug: string }) {
  return prisma.postsOnUsers.findMany({
    where: { postSlug },
  });
}
// migracja db i przekminić jak to dodawać nowych userów i jak wyświeltać wgl
export async function createPostsOnUsers({
  userId,
  postSlug,
}: {
  userId: string;
  postSlug: string;
}) {
  return prisma.postsOnUsers.create({
    data: {
      postSlug,
      userId,
    },
  });
}

export async function checkPostAccess({
  userId,
  postSlug,
}: {
  userId: string;
  postSlug: string;
}) {
  const postsOnUsers = await getPostsOnUsers({ userId });

  if (!postsOnUsers.some((post) => post.postSlug === postSlug))
    throw redirect(`/posts`);
}
