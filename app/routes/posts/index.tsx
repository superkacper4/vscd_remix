import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { addNewButtonLinks } from "~/components/AddNewButton";
import Nav, { navLinks } from "~/components/Nav";
import { postTileLinks } from "~/components/PostTile";
import type { getPosts } from "~/models/post.server";
import { getPostsByPostSlug } from "~/models/post.server";
import { getPostsOnUsers } from "~/models/postsOnUsers.server";
import { requireUserId } from "~/session.server";
import PostsPage, { postsPageLinks } from "~/views/Posts";

type LoaderData = {
  // this is a handy way to say: "posts is whatever type getPosts resolves to"
  posts: Awaited<ReturnType<typeof getPosts>>;
};

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await requireUserId(request);

  const postsOnUsers = await getPostsOnUsers({
    userId,
  });

  const postsIds = postsOnUsers.map((post) => post.postSlug);
  console.log(postsOnUsers);

  return json<LoaderData>({
    posts: await getPostsByPostSlug({ postsIds }),
  });
};

export const links: LinksFunction = () => {
  return [
    ...postsPageLinks(),
    ...navLinks(),
    ...postTileLinks(),
    ...addNewButtonLinks(),
  ];
};

export default function Posts() {
  const { posts } = useLoaderData() as LoaderData;
  return (
    <>
      <PostsPage posts={posts} />
    </>
  );
}
