import { marked } from "marked";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getPost } from "~/models/post.server";
import invariant from "tiny-invariant";

import type { Post } from "~/models/post.server";
import { getNewestCommit } from "~/models/commit.server";
import { getFiles } from "~/models/file.server";
import { getFilesOnCommits } from "~/models/filesOnCommits.server";

type LoaderData = {
  post: Post;
  html: string;
  // newestCommit: Commit;
  files: any;
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
  const html = marked(post.markdown);
  return json<LoaderData>({ post, html, files });
};

export default function PostSlug() {
  const { post, html, files } = useLoaderData() as LoaderData;
  return (
    <main className="mx-auto max-w-4xl">
      <Link to="new" className="text-blue-600 underline">
        Create a New Commit
      </Link>
      {files?.map((file) => (
        <p>{file.path}</p>
      ))}
      <h1 className="my-6 border-b-2 text-center text-3xl">{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
}
