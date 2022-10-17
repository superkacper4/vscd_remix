import type { Post, File, Commit, User } from "@prisma/client";
import { Form, Link, useSubmit } from "@remix-run/react";
import type { LinksFunction } from "@remix-run/server-runtime";
import AddNewButton from "~/components/AddNewButton";
import Nav from "~/components/Nav";
import styles from "./PostPage.css";

export const postPageLinks: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

const PostPage = ({
  post,
  files,
  commit,
  user,
  commits,
}: {
  post: Post;
  files: File[] | undefined;
  commit: Commit | undefined;
  user: User | undefined;
  commits: Commit[] | undefined;
}) => {
  const submit = useSubmit();
  return (
    <main className="post-bg">
      <Nav title={post.title} />
      <AddNewButton url="new" label="+ New Commit" />

      <div className="post-bg-wrapper">
        <div className="post-bg-content">
          <h1 className="my-6 border-b-2 text-center text-3xl">{post.slug}</h1>
          <h2 className="my-4 text-center text-xl">{commit?.message}</h2>
          <h3 className="my-4 text-center text-xl">{user?.email}</h3>
          <Form method="get">
            {commits?.map((commit) => {
              return (
                <p>
                  <Link to={`?id=${commit.id}`} replace>
                    {commit.id}
                  </Link>
                </p>
              );
            })}
          </Form>
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
