import type { ActionFunction } from "@remix-run/server-runtime";
import type { File } from "@prisma/client";

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

export const filesPageAction: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();

  const fileKey = formData.get("fileKey");
  const fileId = formData.get("fileId");
  const userId = formData.get("userId");

  if (fileKey) {
    console.log("filekey", fileKey);
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

    await createCommit({ postSlug, message, userId, commitId, isTag: false }); // create commit and s3 folder
    await createFilesOnCommits({ commitId, filesId: filteredFilesIds }); // connect commits and files to each other

    // const url = await downloadFileFromS3(String(fileKey));

    return null;
  } else if (userId) {
    const postSlug = params.slug;

    invariant(postSlug, "postSlug is required");
    invariant(userId, "userId is required");

    await createPostsOnUsers({ userId: String(userId), postSlug });

    return null;
  } else return null;
};

const FilesPage = ({
  isNewestCommit,
  files,
}: {
  files: File[] | undefined;
  isNewestCommit: Boolean;
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
            {isNewestCommit ? (
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
              <p>{file.name}</p>
              <p className="fileId">{file.id}</p>
              <p>
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
  );
};

export default FilesPage;