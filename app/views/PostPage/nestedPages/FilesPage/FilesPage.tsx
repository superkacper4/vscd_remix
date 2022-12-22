import type { ActionFunction } from "@remix-run/server-runtime";
import type { File, Post } from "@prisma/client";

import { json } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { downloadFileFromS3, getFiles } from "~/models/file.server";
import { requireUserId } from "~/session.server";
import { v4 as uuidv4 } from "uuid";
import { createCommit, getPreviousCommit } from "~/models/commit.server";
import {
  createFilesOnCommits,
  getFilesOnCommits,
} from "~/models/filesOnCommits.server";
import { createPostsOnUsers } from "~/models/postsOnUsers.server";
import { useState } from "react";
import { Form } from "@remix-run/react";
import { cutTimeFromDate } from "helpers/helpers";

export const filesPageAction: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();

  const fileKey = formData.get("fileKey");
  const fileId = formData.get("fileId");
  const userId = formData.get("userId");

  if (fileKey) {
    const url = await downloadFileFromS3(String(fileKey));

    return json({ url });
  } else if (fileId) {
    invariant(params.id, `params.id is required`);

    const postId = params.id;
    const userId = await requireUserId(request); // get user creating commit
    const commitId = uuidv4(); // genereate commit id
    const previousCommit = await getPreviousCommit({ postId });

    const filesOnCommits = await getFilesOnCommits({
      commitId: previousCommit[0]?.id,
    });
    const filesIdArray = filesOnCommits?.map((file) => file?.fileId);
    const files = await getFiles({ id: filesIdArray });

    const filteredFiles = files.filter((file) => file.id !== fileId);

    const filteredFilesIds = filteredFiles.map((file) => file.id);
    const message = `Deleted file: ${fileId}`;

    await createCommit({ postId, message, userId, commitId, isTag: false }); // create commit and s3 folder
    await createFilesOnCommits({ commitId, filesId: filteredFilesIds }); // connect commits and files to each other

    // const url = await downloadFileFromS3(String(fileKey));

    return null;
  } else return null;
};

const FilesPage = ({
  isNewestCommit,
  files,
  post,
}: {
  files: (File & { post: Post })[] | undefined;
  isNewestCommit: Boolean;
  post: Post;
}) => {
  const [downloadFilePath, setDownloadFilePath] = useState<string>("");
  const [deleteFileId, setDeleteFileId] = useState<string>("");
  return (
    <div>
      <h2 className="h2">Files:</h2>
      <Form method="post">
        <input name="fileKey" type="hidden" value={downloadFilePath} />
        <input name="fileId" type="hidden" value={deleteFileId} />
        {files?.map((file) => (
          <div key={file.id}>
            {isNewestCommit && file.postId === post.id ? (
              <button
                type="submit"
                onClick={() => {
                  setDeleteFileId(file.id);
                }}
              >
                X
              </button>
            ) : null}
            <button
              type="submit"
              className="fileTile"
              onClick={() => {
                setDownloadFilePath(file.path);
              }}
            >
              <p className="fileName">{file.name}</p>
              <p className="fileId">{file.post.title}</p>
              <p className="fileDate">
                {cutTimeFromDate({ date: file.createdAt })}
              </p>
            </button>
          </div>
        ))}
      </Form>
    </div>
  );
};

export default FilesPage;
