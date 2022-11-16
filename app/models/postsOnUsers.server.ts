import type { User } from "@prisma/client";
import { prisma } from "~/db.server";

export async function getPostsOnUsers({ userId }: { userId: User["id"] }) {
  return prisma.postsOnUsers.findMany({
    where: { userId },
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
