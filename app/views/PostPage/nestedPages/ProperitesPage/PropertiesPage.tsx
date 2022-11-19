import type { Post, PostsOnUsers } from "@prisma/client";
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

const PropertiesPage = ({
  post,
  usersOnPosts,
}: {
  post: Post;
  usersOnPosts: PostsOnUsers[];
}) => {
  console.log(usersOnPosts);
  return (
    <div>
      <div>
        <p>title: {post.title}</p>
        <p>id: {post.slug}</p>
        <p>created at: {post.createdAt}</p>
        <p>description: {post.markdown}</p>

        <h3>Add contributor</h3>
        <Form method="post">
          <input type="text" name="userId" />
          <button type="submit">Add user</button>
        </Form>
        <p>contributors: </p>
        {usersOnPosts.map((user) => (
          <p key={user.userId}>{user.userId}</p>
        ))}
      </div>
    </div>
  );
};

export default PropertiesPage;
