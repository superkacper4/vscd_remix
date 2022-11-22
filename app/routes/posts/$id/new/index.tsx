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

  invariant(params.id, `params.id is required`);
  const postId = params.id;

  await checkPostAccess({ userId, postId });

  return json({
    postId,
  });
};

export const action: ActionFunction = async ({ request, params }) => {
  await newCommitPageAction({ request, params });
  const postId = params.id;

  return redirect(`/posts/${postId}`);
};

export default function NewPost() {
  const { postId } = useLoaderData();
  return <NewCommitPage postId={postId} />;
}
