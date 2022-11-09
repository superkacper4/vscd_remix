import type {
  ActionFunction,
  LinksFunction,
  LoaderArgs,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { navLinks } from "~/components/Nav";
import NewCommitPage, {
  newCommitPageAction,
  newCommitPageLinks,
} from "~/views/NewCommitPage";

export const links: LinksFunction = () => {
  return [...newCommitPageLinks(), ...navLinks()];
};

export const loader = async ({ params }: LoaderArgs) => {
  const postSlug = params.slug;
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
