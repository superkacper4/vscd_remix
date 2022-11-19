import type { Post, PostsOnUsers } from "@prisma/client";
import { Form, Link } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { addParent } from "~/models/post.server";
import { createPostsOnUsers } from "~/models/postsOnUsers.server";

export const propertiesPageAction: ActionFunction = async ({
  request,
  params,
}) => {
  const formData = await request.formData();

  const userId = formData.get("userId");
  const parentId = formData.get("parentId");
  console.log("parentID", parentId);

  const postSlug = params.slug;

  if (parentId) {
    console.log("parentID", parentId);
    const x = await addParent({ slug: postSlug, parentId });
    console.log(x);
  } else if (userId) {
    invariant(postSlug, "postSlug is required");
    invariant(userId, "userId is required");

    // await createPostsOnUsers({ userId: String(userId), postSlug });

    return null;
  } else return null;
};

const PropertiesPage = ({
  post,
  usersOnPosts,
}: {
  post: Post & { children: Post[] };
  usersOnPosts: PostsOnUsers[];
}) => {
  console.log(post);
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
        <Form method="post">
          <input type="text" name="parentId" />
          <button type="submit">Add Parent</button>
        </Form>
        {post.parentId ? (
          <>
            <p>parent:</p>
            <Link to={`/posts/${post.parentId}`}>{post.parentId}</Link>
          </>
        ) : null}

        {post?.children.length > 0 ? <p>children:</p> : null}
        {post?.children.map((child) => (
          <Link to={`/posts/${child.slug}`} key={child.slug}>
            {child.slug}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PropertiesPage;
