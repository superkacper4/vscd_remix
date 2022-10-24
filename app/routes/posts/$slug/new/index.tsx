import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { createCommit, getNewestCommit, Post } from "~/models/commit.server";
import { createFiles } from "~/models/file.server";
import {
  createFilesOnCommits,
  getFilesOnCommits,
} from "~/models/filesOnCommits.server";
import { getPost } from "~/models/post.server";
import { requireUserId } from "~/session.server";
import { v4 as uuidv4 } from "uuid";

type ActionData =
  | {
      message: null | string;
      files: null | string;
    }
  | undefined;

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);

  invariant(params.slug, `params.slug is required`);

  const postSlug = params.slug;
  // code belowe is for geting last commits files to compare them with files from cuurent commit (which is being created)
  // const newestCommit = await getNewestCommit({ postSlug: params.slug });
  // let newestCommitFiles;

  // if (newestCommit.length > 0) {
  //   newestCommitFiles = getFilesOnCommits({ commitId: newestCommit[0].id });
  // }

  const formData = await request.formData();

  const message = formData.get("message");
  const files = formData.getAll("file");

  const errors: ActionData = {
    message: message ? null : "Message is required",
    files: files ? null : "file is required",
  };
  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) {
    return json<ActionData>(errors);
  }

  invariant(typeof message === "string", "title must be a string");
  // invariant(typeof files === "string", "file must be a string");

  const fileIdTmp = uuidv4();
  const fileIdTmp2 = uuidv4();
  const filesTmp = [
    { path: "nowe", id: fileIdTmp },
    { path: "drugie", id: fileIdTmp2 },
  ];
  const filesId = [{ id: fileIdTmp }, { id: fileIdTmp2 }];

  await createFiles(filesTmp); // create files in tmp s3 folder
  const commit = await createCommit({ postSlug, message, userId }); // create commit and s3 folder
  await createFilesOnCommits({ commitId: commit.id, filesId }); // connect commits and files to each other

  // move files in s3 to commit folder

  return redirect("/posts");
};

const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg`;

export default function NewPost() {
  const errors = useActionData();

  return (
    <Form method="post" encType="multipart/form-data">
      <p>
        <label>
          Commit Message:{" "}
          {errors?.message ? (
            <em className="text-red-600">{errors.message}</em>
          ) : null}
          <input type="text" name="message" className={inputClassName} />
        </label>
      </p>
      <p>
        <label>
          File
          {errors?.file ? (
            <em className="text-red-600">{errors.file}</em>
          ) : null}
          {/* <input id="file" type="text" name="file" /> */}
          <input
            id="file"
            type="file"
            multiple
            name="file"
            className={inputClassName}
          />
        </label>
      </p>
      <p className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
        >
          Create Commit
        </button>
      </p>
    </Form>
  );
}
