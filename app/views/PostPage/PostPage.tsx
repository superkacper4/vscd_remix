import type { Post, File, Commit, User } from "@prisma/client";
import { Form, Link, useActionData, useSubmit } from "@remix-run/react";
import type { ActionFunction, LinksFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import AddNewButton from "~/components/AddNewButton";
import Nav from "~/components/Nav";
import { downloadFileFromS3 } from "~/models/file.server";
import styles from "./PostPage.css";

export const postPageLinks: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export const postPageAction: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const fileKey = formData.get("fileKey");

  const url = await downloadFileFromS3(String(fileKey));

  return json(url);
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
  return (
    <main className="post-bg">
      <Nav title={post.title} linkTo="/posts" />
      <AddNewButton url="new" label="+ New Commit" />

      <div className="post-bg-wrapper">
        <div className="post-bg-content">
          <h1 className="my-6 border-b-2 text-center text-3xl">{post.slug}</h1>
          <div className="commitInfoWrapper">
            <h3 className="h3">{user?.email}</h3>
            <p className="p">{commit?.message}</p>
          </div>
          <div className="commitSelector">
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
          </div>
          <h2 className="h2">Files:</h2>
          <Form method="post">
            {files?.map((file) => (
              <>
                <input name="fileKey" type="hidden" value={file.path} />

                <button type="submit" className="fileTile" key={file.id}>
                  <p>{file.name}</p>
                  <p className="date">
                    {String(file.createdAt).slice(
                      0,
                      String(file.createdAt).indexOf("T")
                    )}
                  </p>
                </button>
              </>
            ))}
          </Form>
        </div>
      </div>
    </main>
  );
};

export default PostPage;
