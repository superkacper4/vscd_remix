import type { User } from "@prisma/client";
import type { LinksFunction } from "@remix-run/server-runtime";
import Button from "~/components/Button";
import Nav from "~/components/Nav";
import PostTile from "~/components/PostTile";
import { deleteFilesFromS3 } from "~/models/file.server";
import styles from "./PostsPage.css";

type LoaderData = {
  posts: { title: string; slug: string; creatorUser: User }[];
};

export const postsPageLinks: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

const PostsPage = ({ posts }: LoaderData) => {
  return (
    <main className="posts-bg">
      <Nav title="Posts" linkTo="/" />
      <div className="posts-bg-content">
        <Button url="new" label="+ New Post" fixed />
        <h1 className="h1">Posts</h1>
        <div className="posts-bg-wrapper">
          {posts?.map((post) => (
            <PostTile
              key={post.slug}
              title={post.title}
              slug={post.slug}
              linkTo={post.slug}
              creatorUser={post.creatorUser.email}
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default PostsPage;
