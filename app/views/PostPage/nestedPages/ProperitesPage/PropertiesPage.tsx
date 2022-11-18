import { Form } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { createPostsOnUsers } from "~/models/postsOnUsers.server";

export const propertiesPageAction: ActionFunction = async ({
  request,
  params,
}) => {
  const formData = await request.formData();

  const userId = formData.get("userId");

  if (userId) {
    const postSlug = params.slug;

    invariant(postSlug, "postSlug is required");
    invariant(userId, "userId is required");

    await createPostsOnUsers({ userId: String(userId), postSlug });

    return null;
  } else return null;
};

const PropertiesPage = () => {
  return (
    <div>
      <Form method="post">
        <input type="text" name="userId" />
        <button type="submit">Add user</button>
      </Form>
    </div>
  );
};

export default PropertiesPage;
