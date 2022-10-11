import { marked } from "marked";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getPost } from "~/models/post.server";
import invariant from "tiny-invariant";

import type { Post } from "~/models/post.server";

type LoaderData = { post: Post; html: string;};


export const loader: LoaderFunction = async ({
    params,
  }) => {
    invariant(params.slug, `params.slug is required`);

    const post = await getPost(params.slug);
    const postSlug = params.slug

    invariant(post, `Post not found: ${postSlug}`);
    const html = marked(post.markdown);
    return json<LoaderData>({ post, html });
};

export default function PostSlug() {
  const { post, html} = useLoaderData() as LoaderData;
  return (
    <main className="mx-auto max-w-4xl">
      <Link to="new" className="text-blue-600 underline">
        Create a New Commit
      </Link>
      <h1 className="my-6 border-b-2 text-center text-3xl">
        {post.title}
      </h1>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
}