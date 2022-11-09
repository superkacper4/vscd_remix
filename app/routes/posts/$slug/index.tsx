import { marked } from "marked";
import type {
  ActionFunction,
  LinksFunction,
  LoaderFunction,
} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useActionData, useLoaderData } from "@remix-run/react";
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
import { addNewButtonLinks } from "~/components/AddNewButton";
import { getUserById } from "~/models/user.server";
import { useEffect } from "react";

type LoaderData = {
  post: Post;
  previousCommit: Commit[] | undefined;
  commits: Commit[] | undefined;
  files: File[] | undefined;
  user: User | undefined;
  commit: Commit | undefined;
};

export const loader: LoaderFunction = async ({ params, request }) => {
  invariant(params.slug, `params.slug is required`);
  const url = new URL(request.url);

  const post = await getPost(params.slug);

  let files;
  let user;
  let commit;
  const commitId = url.searchParams.get("id");
  const previousCommit = await getPreviousCommit({ postSlug: params.slug });
  const commits = await getCommits({ postSlug: params.slug });

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
    commit = await getCommit(commitId); // this needs more protection (to only download commits from good post)
    files = await getFiles({ id: filesIdArray });
    user = await getUserById(commit.userId);
  }

  const postSlug = params.slug;

  invariant(post, `Post not found: ${postSlug}`);
  return json<LoaderData>({
    post,
    files,
    previousCommit,
    user,
    commits,
    commit,
  });
};

export const links: LinksFunction = () => {
  return [...postPageLinks(), ...navLinks(), ...addNewButtonLinks()];
};

export const action: ActionFunction = async ({ request, params }) => {
  const downloadUrl = await postPageAction({ request });
  const postSlug = params.slug;

  return downloadUrl;
};

export default function PostSlug() {
  const { post, files, previousCommit, user, commits, commit } =
    useLoaderData() as LoaderData;

  const actionData = useActionData();

  useEffect(() => {
    console.log(actionData);

    if (actionData) {
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
    />
  );
}
