import type { ActionFunction, UploadHandler } from "@remix-run/node";
import { unstable_parseMultipartFormData } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { createCommit, getNewestCommit, Post } from "~/models/commit.server";
import { createFile } from "~/models/file.server";
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

  let uploadHandler: UploadHandler = async ({ filename, name, data }) => {
    if (filename) {
      // data.next().then((value) => console.log(value.value));
      const content = await data.next().then((value) => value.value);
      const filesForPrisma = {
        name: filename,
        id: uuidv4(),
        content,
      };

      // console.log(filesForPrisma);
      const createdFile = await createFile(filesForPrisma); // create files in tmp s3 folder

      console.log("createdFile", createdFile);

      const fileId = createdFile.id;
      console.log(filename, name, filesForPrisma);

      // const fileId = "xd";
      return fileId;
    }

    if ((name = "message")) {
      const content = await data.next().then((value) => value.value);
      const message = String.fromCharCode.apply(null, content);
      return message;
    }
  };

  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );
  console.log("from", formData);

  // const formData = await request.formData();

  const message = formData.get("message");
  const files = formData.getAll("file");

  console.log("msg", message, "files", files);

  const commit = await createCommit({ postSlug, message, userId }); // create commit and s3 folder
  await createFilesOnCommits({ commitId: commit.id, filesId: files }); // connect commits and files to each other

  // move files in s3 to commit folder

  // const errors: ActionData = {
  //   message: message ? null : "Message is required",
  //   files: files ? null : "file is required",
  // };
  // const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  // if (hasErrors) {
  //   return json<ActionData>(errors);
  // }

  // invariant(typeof message === "string", "title must be a string");
  // // invariant(typeof files === "string", "file must be a string");

  return redirect(`/posts/${postSlug}`);
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
