import { Link } from "@remix-run/react";
import { LinksFunction } from "@remix-run/server-runtime";
import Nav from "~/components/Nav"
import { getPosts } from "~/models/post.server";
import styles from './PostsPage.css'

type LoaderData = {
  posts: Awaited<ReturnType<typeof getPosts>>;
};

export const postsPageLinks: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
}

const PostsPage = ({posts}: LoaderData) => {
    console.log(posts);
    return (
      <main className="posts-bg">
      <Nav title="Posts"/>
      <h1>Posts</h1>
      <Link to="admin" className="text-red-600 underline">
        Admin
      </Link>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              to={post.slug}
              className="text-blue-600 underline"
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
      </main>
    );
}

export default PostsPage