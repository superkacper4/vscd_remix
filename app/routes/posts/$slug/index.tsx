import { marked } from "marked";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getPost } from "~/models/post.server";
import invariant from "tiny-invariant";

import type { Post, File } from "@prisma/client";
import { getNewestCommit } from "~/models/commit.server";
import { getFiles } from "~/models/file.server";
import { getFilesOnCommits } from "~/models/filesOnCommits.server";
import PostPage, { postPageLinks } from "~/views/PostPage";
import { navLinks } from "~/components/Nav";
import { addNewButtonLinks } from "~/components/AddNewButton";

type LoaderData = {
  post: Post;
  // newestCommit: Commit;
  files: File[];
};

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, `params.slug is required`);

  const post = await getPost(params.slug);
  let files;
  const newestCommit = await getNewestCommit({ postSlug: params.slug });

  if (newestCommit.length > 0) {
    const filesOnCommits = await getFilesOnCommits({
      commitId: newestCommit[0]?.id,
    });
    const filesIdArray = filesOnCommits.map((file) => file?.fileId);
    files = await getFiles({ id: filesIdArray });
  }

  const postSlug = params.slug;

  invariant(post, `Post not found: ${postSlug}`);
  return json<LoaderData>({ post, files });
};

export const links: LinksFunction = () => {
  return [...postPageLinks(), ...navLinks(), ...addNewButtonLinks()];
};

export default function PostSlug() {
  const { post, files } = useLoaderData() as LoaderData;
  return <PostPage post={post} files={files} />;
}
