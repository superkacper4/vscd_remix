import type { Post, File, Commit, User } from "@prisma/client";
import { Form } from "@remix-run/react";
import type { ActionFunction, LinksFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { useState } from "react";
import AddNewButton from "~/components/AddNewButton";
import CommitSelector from "~/components/CommitSelector";
import Nav from "~/components/Nav";
import { createCommit, getPreviousCommit } from "~/models/commit.server";
import { downloadFileFromS3, getFiles } from "~/models/file.server";
import {
  createFilesOnCommits,
  getFilesOnCommits,
} from "~/models/filesOnCommits.server";
import { requireUserId } from "~/session.server";
import styles from "./PostPage.css";
import { v4 as uuidv4 } from "uuid";
import invariant from "tiny-invariant";

export const postPageLinks: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export const postPageAction: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();

  const fileKey = formData.get("fileKey");
  const fileId = formData.get("fileId");

  console.log(fileKey);

  if (fileKey) {
    const url = await downloadFileFromS3(String(fileKey));

    return json(url);
  } else if (fileId) {
    invariant(params.slug, `params.slug is required`);

    const postSlug = params.slug;
    const userId = await requireUserId(request); // get user creating commit
    const commitId = uuidv4(); // genereate commit id
    const previousCommit = await getPreviousCommit({ postSlug });

    const filesOnCommits = await getFilesOnCommits({
      commitId: previousCommit[0]?.id,
    });
    const filesIdArray = filesOnCommits?.map((file) => file?.fileId);
    const files = await getFiles({ id: filesIdArray });

    const filteredFiles = files.filter((file) => file.id !== fileId);

    const filteredFilesIds = filteredFiles.map((file) => file.id);
    const message = `Deleted file: ${fileId}`;

    await createCommit({ postSlug, message, userId, commitId }); // create commit and s3 folder
    await createFilesOnCommits({ commitId, filesId: filteredFilesIds }); // connect commits and files to each other

    // const url = await downloadFileFromS3(String(fileKey));

    return null;
  } else return null;
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
  const [downloadFilePath, setDownloadFilePath] = useState<string>("");
  const [deleteFileId, setDeleteFileId] = useState<string>("");

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
          <CommitSelector commits={commits} />
          <h2 className="h2">Files:</h2>
          <Form method="post">
            <input name="fileKey" type="hidden" value={downloadFilePath} />
            <input name="fileId" type="hidden" value={deleteFileId} />
            {files?.map((file) => (
              <div key={file.id}>
                <button
                  type="submit"
                  onClick={() => {
                    setDeleteFileId(file.id);
                  }}
                >
                  X
                </button>
                <button
                  type="submit"
                  className="fileTile"
                  onClick={() => {
                    setDownloadFilePath(file.path);
                  }}
                >
                  <p>{file.name}</p>
                  <p className="date">
                    {String(file.createdAt).slice(
                      0,
                      String(file.createdAt).indexOf("T")
                    )}
                  </p>
                </button>
              </div>
            ))}
          </Form>
        </div>
      </div>
    </main>
  );
};

export default PostPage;
