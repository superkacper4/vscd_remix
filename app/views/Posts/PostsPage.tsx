import { Link } from "@remix-run/react";
import { LinksFunction } from "@remix-run/server-runtime";
import Nav from "~/components/Nav"
import PostTile from "~/components/PostTile";
import { getPosts } from "~/models/post.server";
import styles from './PostsPage.css'

type LoaderData = {
  posts: Awaited<ReturnType<typeof getPosts>>;
};

export const postsPageLinks: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
}

const PostsPage = ({posts}: LoaderData) => {
    return (
      <main className="posts-bg">
      <Nav title="Posts"/>
      <div className="posts-bg-content">
        <div className="posts-bg-add-button">
          <Link to="admin">
            + New
          </Link>
        </div>
        <h1 className="h1">Posts</h1>
        <div className="posts-bg-wrapper">
          {posts.map((post) => (
            <PostTile
              key={post.slug}
              title={post.title}
              slug={post.slug}
              linkTo={post.slug}
            />
          ))}
        </div>
      </div>
      </main>
    );
}

export default PostsPage