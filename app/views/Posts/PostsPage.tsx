import type { User } from "@prisma/client";
import type { LinksFunction } from "@remix-run/server-runtime";
import Button from "~/components/Button";
import Nav from "~/components/Nav";
import PostTile from "~/components/PostTile";
import styles from "./PostsPage.css";

type LoaderData = {
  posts: { title: string; id: string; creatorUser: User }[];
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
              key={post.id}
              title={post.title}
              id={post.id}
              linkTo={post.id}
              creatorUser={post.creatorUser.email}
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default PostsPage;
