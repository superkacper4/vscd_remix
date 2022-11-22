import { Form, useActionData } from "@remix-run/react";
import type { ActionFunction, LinksFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import Nav from "~/components/Nav";
import { createPost } from "~/models/post.server";
import { createPostsOnUsers } from "~/models/postsOnUsers.server";
import { requireUserId } from "~/session.server";
import styles from "./NewPostPage.css";
import { v4 as uuidv4 } from "uuid";

type ActionData =
  | {
      title: null | string;
    }
  | undefined;

export const newPostPageLinks: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export const newPostPageAction: ActionFunction = async ({ request }) => {
  const creatorUserId = await requireUserId(request);
  const postId = uuidv4();

  const formData = await request.formData();

  const title = formData.get("title");
  const markdown = formData.get("markdown");

  const errors: ActionData = {
    title: title ? null : "Title is required",
  };
  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) {
    return json<ActionData>(errors);
  }

  invariant(typeof title === "string", "title must be a string");
  invariant(typeof markdown === "string", "markdown must be a string");

  await createPost({ title, id: postId, markdown, creatorUserId });
  await createPostsOnUsers({ postId, userId: creatorUserId });
};

const NewPostPage = ({ errors }: { errors: ActionData }) => {
  return (
    <main className="newPost-bg">
      <Nav title="Create Post" linkTo="/posts" />

      <div className="newPost-bg-content">
        <div className="newPost-bg-wrapper">
          <Form method="post" encType="multipart/form-data">
            <p>
              <label>
                Post Title:{" "}
                {errors?.title ? (
                  <em className="text-red-600">{errors.title}</em>
                ) : null}
                <input type="text" name="title" />
              </label>
            </p>
            <p>
              <label htmlFor="markdown">Markdown:</label>
              <br />
              <textarea id="markdown" rows={20} name="markdown" />
            </p>
            <p className="text-right">
              <button
                type="submit"
                className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
              >
                Create Post
              </button>
            </p>
          </Form>
        </div>
      </div>
    </main>
  );
};

export default NewPostPage;
