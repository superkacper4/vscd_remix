import type {
  ActionFunction,
  LinksFunction,
  LoaderFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { getPost } from "~/models/post.server";
import invariant from "tiny-invariant";

import type { Post, File, Commit, User } from "@prisma/client";
import {
  getCommit,
  getCommits,
  getPreviousCommit,
} from "~/models/commit.server";
import { getFiles } from "~/models/file.server";
import { getFilesOnCommits } from "~/models/filesOnCommits.server";
import PostPage, { postPageAction, postPageLinks } from "~/views/PostPage";
import { navLinks } from "~/components/Nav";
import { buttonLinks } from "~/components/Button";
import { getUserById } from "~/models/user.server";
import { useEffect } from "react";
import { checkPostAccess } from "~/models/postsOnUsers.server";
import { requireUserId } from "~/session.server";
import { filesPageAction } from "~/views/PostPage/nestedPages/FilesPage";

type LoaderData = {
  post: Post;
  previousCommit: Commit[] | undefined;
  commits: Commit[] | undefined;
  files: File[] | undefined;
  user: User | undefined;
  commit: Commit | undefined;
  isNewestCommit: Boolean;
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const userId = await requireUserId(request);

  invariant(params.slug, `params.slug is required`);
  const postSlug = params.slug;

  await checkPostAccess({ userId, postSlug });

  const url = new URL(request.url);

  const post = await getPost(params.slug);

  let files;
  let user;
  let commit;
  const commitId = url.searchParams.get("id");
  const previousCommit = await getPreviousCommit({ postSlug });
  const commits = await getCommits({ postSlug });

  if (!commitId && previousCommit.length > 0) {
    const filesOnCommits = await getFilesOnCommits({
      commitId: previousCommit[0]?.id,
    });
    const filesIdArray = filesOnCommits.map((file) => file?.fileId);
    files = await getFiles({ id: filesIdArray });
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

  invariant(post, `Post not found: ${postSlug}`);
  return json<LoaderData>({
    post,
    files,
    previousCommit,
    user,
    commits,
    commit,
    isNewestCommit: !commitId || commitId === previousCommit[0]?.id,
  });
};

export const links: LinksFunction = () => {
  return [...postPageLinks(), ...navLinks(), ...buttonLinks()];
};

export const action: ActionFunction = async ({ request, params }) => {
  const downloadUrl = await filesPageAction({ request, params });
  console.log("dwnURL", downloadUrl);

  return downloadUrl;
};

export default function PostSlug() {
  const { post, files, previousCommit, user, commits, commit, isNewestCommit } =
    useLoaderData() as LoaderData;

  const actionData = useActionData();

  useEffect(() => {
    if (actionData) {
      console.log("actiondata", actionData);
      let alink = document.createElement("a");
      alink.href = actionData;
      alink.click();
    }
  }, [actionData]);

  return (
    <PostPage
      post={post}
      files={files}
      commit={commit ? commit : previousCommit[0]}
      user={user}
      commits={commits}
      isNewestCommit={isNewestCommit}
    />
  );
}
