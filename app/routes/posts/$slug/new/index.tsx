import type { ActionFunction, LinksFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { navLinks } from "~/components/Nav";
import NewCommitPage, {
  newCommitPageAction,
  newCommitPageLinks,
} from "~/views/NewCommitPage";

export const links: LinksFunction = () => {
  return [...newCommitPageLinks(), ...navLinks()];
};

export const action: ActionFunction = async ({ request, params }) => {
  await newCommitPageAction({ request, params });
  const postSlug = params.slug;

  return redirect(`/posts/${postSlug}`);
};

export default function NewPost() {
  return <NewCommitPage />;
}
