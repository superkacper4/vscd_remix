import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { createCommit, Post } from "~/models/commit.server";
import { getPost } from "~/models/post.server";
import { requireUserId } from "~/session.server";

type ActionData =
  | {
      message: null | string;
      file: null | string;
    }
  | undefined;


export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);

  invariant(params.slug, `params.slug is required`);

  const postSlug = params.slug

  const formData = await request.formData();

  const message = formData.get("message");
  const file = formData.get("file");

  const errors: ActionData = {
    message: message ? null : "Message is required",
    file: file ? null : "file is required",
  };
  const hasErrors = Object.values(errors).some(
    (errorMessage) => errorMessage
  );
  if (hasErrors) {
    return json<ActionData>(errors);
  }

  invariant(
    typeof message === "string",
    "title must be a string"
  );
  invariant(
    typeof file === "string",
    "file must be a string"
  );

  await createCommit({ postSlug, message ,file, userId});

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
          <input
            type="text"
            name="message"
            className={inputClassName}
          />
        </label>
      </p>
      <p>
        <label>
          File
          {errors?.file ? (
            <em className="text-red-600">{errors.file}</em>
          ) : null}
        {/* <input id="file" type="file" name="file" multiple/> */}
        <input id="file" type="text" name="file" className={inputClassName}/>
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