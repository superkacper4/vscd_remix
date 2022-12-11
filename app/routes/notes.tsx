import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";

import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import { getNoteListItems } from "~/models/note.server";
import Nav, { navLinks } from "~/components/Nav";

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const noteListItems = await getNoteListItems({ userId });
  return json({ noteListItems });
}

export const links: LinksFunction = () => {
  return [...navLinks()];
};

export default function NotesPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="flex h-full min-h-screen flex-col">
      <Nav title="Notes" linkTo="/" />

      <main
        className="flex h-full"
        style={{
          backgroundColor: "var(--mainBgDark)",
          color: "var(--fontColor)",
        }}
      >
        <div className="h-full w-80 border-r">
          <Link to="new" className="block p-4 text-xl">
            + New Note
          </Link>

          <hr />

          {data.noteListItems.length === 0 ? (
            <p className="p-4">No notes yet</p>
          ) : (
            <ol>
              {data.noteListItems.map((note) => (
                <li key={note.id}>
                  <NavLink
                    className={({ isActive }) =>
                      `block border-b p-4 text-xl ${
                        isActive ? "bg-slate-600" : ""
                      }`
                    }
                    to={note.id}
                  >
                    📝 {note.title}
                  </NavLink>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
