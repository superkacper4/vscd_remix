import type { ActionFunction, LinksFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { navLinks } from "~/components/Nav";
import NewPostPage, {
  newPostPageAction,
  newPostPageLinks,
} from "~/views/NewPostPage";

export const links: LinksFunction = () => {
  return [...newPostPageLinks(), ...navLinks()];
};

export const action: ActionFunction = async ({ request }) => {
  const newPostPageError = await newPostPageAction({ request });

  if (newPostPageError) return newPostPageError;
  else return redirect("/posts");
};

export default function NewPost() {
  const errors = useActionData();

  return <NewPostPage errors={errors} />;
}
