import type { ActionFunction, LinksFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { navLinks } from "~/components/Nav";
import NewPostPage, {
  newPostPageAction,
  newPostPageLinks,
} from "~/views/NewPostPage";

export const links: LinksFunction = () => {
  return [...newPostPageLinks(), ...navLinks()];
};

export const action: ActionFunction = async ({ request }) => {
  await newPostPageAction({ request });

  return redirect("/posts");
};

export default function NewPost() {
  return <NewPostPage />;
}
