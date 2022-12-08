import type { Post, PostsOnUsers, User } from "@prisma/client";
import { Form, Link, useActionData } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { cutTimeFromDate } from "helpers/helpers";
import invariant from "tiny-invariant";
import PostTile from "~/components/PostTile";
import { deleteAllCommits, getCommitsIds } from "~/models/commit.server";
import { deleteFilesFromS3 } from "~/models/file.server";
import { deleteFilesOnCommits } from "~/models/filesOnCommits.server";
import { addParent, deletePost } from "~/models/post.server";
import {
  createPostsOnUsers,
  deletePostOnUsers,
  getPostsOnUsers,
  getUsersOnPost,
} from "~/models/postsOnUsers.server";
import { getUserByEmail } from "~/models/user.server";
import { requireUserId } from "~/session.server";

type ActionDataUser =
  | {
      userId: null | string;
    }
  | undefined;

type ActionDataParent =
  | {
      parentId: null | string;
    }
  | undefined;

export const propertiesPageAction: ActionFunction = async ({
  request,
  params,
}) => {
  const formData = await request.formData();

  const userId = formData.get("userId");
  const parentId = formData.get("parentId");
  const confirmDelete = formData.get("confirmDelete");

  const postId = params.id;
  invariant(postId, "post.id is required");

  // deleting post
  if (confirmDelete === "delete") {
    await deletePostOnUsers({ id: postId });
    const commitsIds = await getCommitsIds({ postId });
    const commitsIdsArray = commitsIds.map((commitId) => commitId.id);
    deleteFilesOnCommits({ commitsIds: commitsIdsArray });
    await deletePost({ id: postId });
    deleteFilesFromS3({ postId });
  }
  // adding parent
  else if (parentId) {
    const user = await requireUserId(request);

    const postsOnUsers = await getPostsOnUsers({ userId: user });

    console.log(postsOnUsers, user);

    const errors: ActionDataParent = {
      parentId: postsOnUsers.some(
        (postOnUser) => postOnUser?.postId === parentId
      )
        ? null
        : "Post does not exist",
    };
    const hasErrors = Object.values(errors).some(
      (errorMessage) => errorMessage
    );
    if (hasErrors) {
      console.log("Error " + errors.parentId);
      return json<ActionDataParent>(errors);
    }

    await addParent({ id: postId, parentId });

    return "addParent";
  }
  // adding contributor
  else if (userId) {
    invariant(userId, "userId is required");

    const usersOnPosts = await getUsersOnPost({ postId });

    const user = await getUserByEmail(String(userId));
    console.log(user);

    const generateUserIdError = () => {
      if (usersOnPosts.some((userOnPost) => userOnPost?.userId === user?.id))
        return "User is already added";
      else if (!user) return "User does not exist";
      else return null;
    };

    const errors: ActionDataUser = {
      userId: generateUserIdError(),
    };
    const hasErrors = Object.values(errors).some(
      (errorMessage) => errorMessage
    );
    if (hasErrors) {
      console.log("Error " + errors.userId);
      return json<ActionDataUser>(errors);
    }

    await createPostsOnUsers({ userId: String(user?.id), postId });

    return "addUser";
  } else return null;
};

const PropertiesPage = ({
  post,
  usersOnPosts,
  inputErrors,
}: {
  post: Post & { children: Post[]; parent: Post };
  usersOnPosts: User[];
  inputErrors: {
    parentIdError: String;
    userIdError: String;
  };
}) => {
  return (
    <div>
      <div>
        <p>title: {post.title}</p>
        <p>id: {post.id}</p>

        <p>created at: {cutTimeFromDate({ date: post.createdAt })}</p>
        {post.markdown ? <p>markdown: {post.markdown}</p> : null}

        <h3>Add contributor</h3>
        <Form method="post">
          {inputErrors?.userIdError ? (
            <em className="text-red-600">{inputErrors?.userIdError}</em>
          ) : null}
          <input type="text" name="userId" placeholder="email@expample.com" />
          <button type="submit">Add user</button>
        </Form>
        <p>contributors: </p>
        {usersOnPosts.map((user) => (
          <p key={user.id}>{user.email}</p>
        ))}
        <h3>Add parent</h3>
        <Form method="post">
          {inputErrors?.parentIdError ? (
            <em className="text-red-600">{inputErrors?.parentIdError}</em>
          ) : null}
          <input type="text" name="parentId" placeholder="Parent Id" />
          <button type="submit">Add Parent</button>
        </Form>
        {post.parentId ? (
          <>
            <p>parent:</p>
            <PostTile
              title={post?.parent.title}
              id={post?.parent.id}
              linkTo={`/posts/${post.parent.id}`}
            />
          </>
        ) : null}

        {post?.children.length > 0 ? <p>children:</p> : null}
        {post?.children.map((child) => (
          <PostTile
            key={child.id}
            title={child.title}
            id={child.id}
            linkTo={`/posts/${child.id}`}
          />
        ))}
        <h3>Delete Post</h3>
        <Form method="post">
          {/* {inputErrors?.parentIdError ? (
            <em className="text-red-600">{inputErrors?.parentIdError}</em>
          ) : null} */}
          <input
            type="text"
            name="confirmDelete"
            placeholder='Type "delete" to delete post'
          />
          <button type="submit">Confirm</button>
        </Form>
      </div>
    </div>
  );
};

export default PropertiesPage;
