import type {
  ActionFunction,
  LinksFunction,
  LoaderArgs,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { navLinks } from "~/components/Nav";
import { checkPostAccess } from "~/models/postsOnUsers.server";
import { requireUserId } from "~/session.server";
import NewCommitPage, {
  newCommitPageAction,
  newCommitPageLinks,
} from "~/views/NewCommitPage";

export const links: LinksFunction = () => {
  return [...newCommitPageLinks(), ...navLinks()];
};

export const loader = async ({ request, params }: LoaderArgs) => {
  const userId = await requireUserId(request);

  invariant(params.slug, `params.slug is required`);
  const postSlug = params.slug;

  await checkPostAccess({ userId, postSlug });

  return json({
    postSlug,
  });
};

export const action: ActionFunction = async ({ request, params }) => {
  await newCommitPageAction({ request, params });
  const postSlug = params.slug;

  return redirect(`/posts/${postSlug}`);
};

export default function NewPost() {
  const { postSlug } = useLoaderData();
  return <NewCommitPage postSlug={postSlug} />;
}
