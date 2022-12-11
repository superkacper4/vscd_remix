import type { Post, User } from "@prisma/client";
import { Form } from "@remix-run/react";
import type { ActionFunction, LinksFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { cutTimeFromDate, mergeFiles } from "helpers/helpers";
import invariant from "tiny-invariant";
import PostTile from "~/components/PostTile";
import {
  createCommit,
  getCommitsIds,
  getPreviousCommit,
} from "~/models/commit.server";
import { deleteFilesFromS3, getFiles } from "~/models/file.server";
import {
  createFilesOnCommits,
  deleteFilesOnCommits,
  getFilesOnCommits,
} from "~/models/filesOnCommits.server";
import { addParent, deletePost, getPost } from "~/models/post.server";
import {
  createPostsOnUsers,
  deletePostOnUsers,
  getPostsOnUsers,
  getUsersOnPost,
} from "~/models/postsOnUsers.server";
import { getUserByEmail } from "~/models/user.server";
import { requireUserId } from "~/session.server";
import { v4 as uuidv4 } from "uuid";
import styles from "./PropertiesPage.css";

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

export const propertiesPageLinks: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

const createCommitInParent = async ({
  postId,
  parentId,
  user,
}: {
  postId: string;
  parentId: string;
  user: string;
}) => {
  const commitId = uuidv4();
  const childrenPreviousCommit = await getPreviousCommit({ postId });
  const previousParentCommit = await getPreviousCommit({ postId: parentId });

  if (childrenPreviousCommit.length > 0 && previousParentCommit.length > 0) {
    await createCommit({
      postId: parentId,
      message: `Download files from: ${postId}`,
      isTag: false,
      commitId,
      userId: user,
    });

    const childrenFilesOnCommits = await getFilesOnCommits({
      commitId: childrenPreviousCommit[0].id,
    });

    const parentFilesOnCommits = await getFilesOnCommits({
      commitId: previousParentCommit[0].id,
    });

    const childrenFilesOnCommitsArray = childrenFilesOnCommits.map(
      (file) => file.fileId
    );
    const parentFilesOnCommitsArray = parentFilesOnCommits.map(
      (file) => file.fileId
    );

    const childrenFiles = await getFiles({
      id: childrenFilesOnCommitsArray,
    });

    const parentFiles = await getFiles({
      id: parentFilesOnCommitsArray,
    });

    const filesId = mergeFiles(childrenFiles, parentFiles);

    console.log(
      "filesId: ",
      filesId,
      "children files: ",
      childrenFilesOnCommits,
      "pareng files: ",
      parentFilesOnCommits
    );
    await createFilesOnCommits({ commitId, filesId });
  }
};

export const propertiesPageAction: ActionFunction = async ({
  request,
  params,
}) => {
  const formData = await request.formData();

  const userId = formData.get("userId");
  const parentId = formData.get("parentId");
  const confirmDelete = formData.get("confirmDelete");
  const uploadParent = formData.get("uploadParent");

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

    await createCommitInParent({ postId, parentId, user });

    return "addParent";
  }
  //upload files from repository to parent repository
  else if (uploadParent) {
    const user = await requireUserId(request);

    const post = await getPost(postId);

    console.log(post);

    await createCommitInParent({ postId, parentId: post?.parentId, user });

    return "uploadToParent";
  }
  // adding contributor
  else if (userId) {
    invariant(userId, "userId is required");

    const usersOnPosts = await getUsersOnPost({ postId });

    const user = await getUserByEmail(String(userId));

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
        <div className="prop-section">
          <p>Title: {post.title}</p>
          <p>Id: {post.id}</p>

          <p>Created at: {cutTimeFromDate({ date: post.createdAt })}</p>
          {post.markdown ? <p>markdown: {post.markdown}</p> : null}
        </div>

        <div className="prop-section">
          <h3>Contributors</h3>
          <Form method="post">
            {inputErrors?.userIdError ? (
              <em className="text-red-600">{inputErrors?.userIdError}</em>
            ) : null}
            <input type="text" name="userId" placeholder="email@expample.com" />
            <p className="text-right">
              <button
                type="submit"
                className="rounded bg-blue-500 py-1 px-2 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
              >
                Confirm
              </button>
            </p>
          </Form>
          <p>Contributors: </p>
          {usersOnPosts.map((user) => (
            <p key={user.id}>{user.email}</p>
          ))}
        </div>

        <div className="prop-section">
          <h3>Inheritance</h3>
          <Form method="post">
            {inputErrors?.parentIdError ? (
              <em className="text-red-600">{inputErrors?.parentIdError}</em>
            ) : null}
            <input type="text" name="parentId" placeholder="Parent Id" />
            <p className="text-right">
              <button
                type="submit"
                className="rounded bg-blue-500 py-1 px-2 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
              >
                Confirm
              </button>
            </p>
          </Form>
          {post.parentId ? (
            <>
              <p>Parent:</p>
              <PostTile
                title={post?.parent.title}
                id={post?.parent.id}
                linkTo={`/posts/${post.parent.id}`}
              />
              <Form method="post">
                <input type="hidden" name="uploadParent" value="true" />
                <p className="text-right">
                  <button
                    type="submit"
                    className="rounded bg-blue-500 py-1 px-2 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
                  >
                    Confirm
                  </button>
                </p>
              </Form>
            </>
          ) : null}

          {post?.children.length > 0 ? <p>Children:</p> : null}
          {post?.children.map((child) => (
            <PostTile
              key={child.id}
              title={child.title}
              id={child.id}
              linkTo={`/posts/${child.id}`}
            />
          ))}
        </div>

        <div className="prop-section">
          <h3>Delete Post</h3>
          <Form method="post">
            <input
              type="text"
              name="confirmDelete"
              placeholder='Type "delete" to delete post'
            />
            <p className="text-right">
              <button
                type="submit"
                className="rounded bg-blue-500 py-1 px-2 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
              >
                Confirm
              </button>
            </p>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPage;
