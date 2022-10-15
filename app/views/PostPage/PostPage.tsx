import type { Post, File } from "@prisma/client";
import type { LinksFunction } from "@remix-run/server-runtime";
import AddNewButton from "~/components/AddNewButton";
import Nav from "~/components/Nav";
import styles from "./PostPage.css";

export const postPageLinks: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

const PostPage = ({ post, files }: { post: Post; files: File[] }) => {
  console.log(files);
  return (
    <main className="post-bg">
      <Nav title={post.title} />
      <AddNewButton url="new" label="+ New Commit" />

      <div className="post-bg-wrapper">
        <div className="post-bg-content">
          <h1 className="my-6 border-b-2 text-center text-3xl">{post.title}</h1>
          <h2 className="my-4 text-center text-xl">{post.slug}</h2>
          <h2 className="h2">Files:</h2>
          {files?.map((file) => (
            <div className="fileTile" key={file.id}>
              <p>{file.path}</p>
              <p>{file.createdAt}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default PostPage;
