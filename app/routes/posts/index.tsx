import type { User } from "@prisma/client";
import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { buttonLinks } from "~/components/Button";
import { navLinks } from "~/components/Nav";
import { postTileLinks } from "~/components/PostTile";
import { getPostsByPostSlug } from "~/models/post.server";
import { getPostsOnUsers } from "~/models/postsOnUsers.server";
import { requireUserId } from "~/session.server";
import PostsPage, { postsPageLinks } from "~/views/Posts";

type LoaderData = {
  posts: ({ title: string; slug: string; creatorUser: User } | null)[];
};

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await requireUserId(request);

  const postsOnUsers = await getPostsOnUsers({
    userId,
  });

  const postsIds = postsOnUsers.map((post) => post.postSlug);

  return json<LoaderData>({
    posts: await getPostsByPostSlug({ postsIds }),
  });
};

export const links: LinksFunction = () => {
  return [
    ...postsPageLinks(),
    ...navLinks(),
    ...postTileLinks(),
    ...buttonLinks(),
  ];
};

export default function Posts() {
  const { posts } = useLoaderData();
  return (
    <>
      <PostsPage posts={posts} />
    </>
  );
}
