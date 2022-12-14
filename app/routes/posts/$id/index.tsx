import type {
  ActionFunction,
  LinksFunction,
  LoaderFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { getPost, getPostChildren } from "~/models/post.server";
import invariant from "tiny-invariant";

import type { Post, File, Commit, User, PostsOnUsers } from "@prisma/client";
import {
  getCommit,
  getCommits,
  getPreviousCommit,
} from "~/models/commit.server";
import { getFiles } from "~/models/file.server";
import { getFilesOnCommits } from "~/models/filesOnCommits.server";
import PostPage, { postPageLinks } from "~/views/PostPage";
import { navLinks } from "~/components/Nav";
import { buttonLinks } from "~/components/Button";
import { getManyUsersById, getUserById } from "~/models/user.server";
import { useEffect } from "react";
import { checkPostAccess, getUsersOnPost } from "~/models/postsOnUsers.server";
import { requireUserId } from "~/session.server";
import { filesPageAction } from "~/views/PostPage/nestedPages/FilesPage";
import { propertiesPageAction } from "~/views/PostPage/nestedPages/ProperitesPage";
import { postTileLinks } from "~/components/PostTile";

type LoaderData = {
  post: Post;
  previousCommit: Commit[] | undefined;
  commits: Commit[] | undefined;
  files: File[] | undefined;
  user: User | undefined;
  commit: Commit | undefined;
  isNewestCommit: Boolean;
  usersOnPosts: User[];
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const userId = await requireUserId(request);

  invariant(params.id, `params.id is required`);
  const postId = params.id;

  await checkPostAccess({ userId, postId });

  const url = new URL(request.url);

  const post = await getPost(postId);

  const usersIdsOnPosts = await getUsersOnPost({ postId });
  const usersIds = usersIdsOnPosts?.map((userId) => userId.userId);
  const usersOnPosts = await getManyUsersById(usersIds);

  let files;
  let user;
  let commit;
  const commitId = url.searchParams.get("id");
  const previousCommit = await getPreviousCommit({ postId });
  const commits = await getCommits({ postId });

  if (!commitId && previousCommit.length > 0) {
    const filesOnCommits = await getFilesOnCommits({
      commitId: previousCommit[0]?.id,
    });
    const filesIdArray = filesOnCommits.map((file) => file?.fileId);
    files = await getFiles({ id: filesIdArray, postId });
    user = await getUserById(previousCommit[0].userId);
  }

  if (commitId) {
    const filesOnCommits = await getFilesOnCommits({
      commitId,
    });
    const filesIdArray = filesOnCommits.map((file) => file?.fileId);
    commit = await getCommit(commitId);
    invariant(commit, `commit is required`);

    files = await getFiles({ id: filesIdArray });
    user = await getUserById(commit.userId);
  }
  const children = await getPostChildren({ id: postId });

  invariant(post, `Post not found: ${postId}`);
  return json<LoaderData>({
    post,
    children,
    files,
    previousCommit,
    user,
    commits,
    commit,
    isNewestCommit: !commitId || commitId === previousCommit[0]?.id,
    usersOnPosts,
  });
};

export const links: LinksFunction = () => {
  return [
    ...postPageLinks(),
    ...navLinks(),
    ...buttonLinks(),
    ...postTileLinks(),
  ];
};

export const action: ActionFunction = async ({ request, params }) => {
  const properitesAction = await propertiesPageAction({
    request: request.clone(),
    params,
  });
  if (properitesAction) {
    return properitesAction;
  }

  const downloadUrl = await filesPageAction({
    request: request.clone(),
    params,
  });
  if (downloadUrl) {
    return downloadUrl;
  }

  return null;
};

export default function PostId() {
  const {
    post,
    files,
    previousCommit,
    user,
    commits,
    commit,
    isNewestCommit,
    usersOnPosts,
    children,
  } = useLoaderData() as LoaderData;

  const actionData = useActionData();

  console.log("frontend:", children);

  useEffect(() => {
    if (actionData?.url) {
      let alink = document.createElement("a");
      alink.href = actionData.url;
      alink.click();
    }
  }, [actionData?.url]);

  return (
    <PostPage
      post={post}
      files={files}
      commit={commit ? commit : previousCommit[0]}
      user={user}
      commits={commits}
      isNewestCommit={isNewestCommit}
      usersOnPosts={usersOnPosts}
      inputErrors={{
        parentIdError: actionData?.parentId,
        userIdError: actionData?.userId,
      }}
    />
  );
}
