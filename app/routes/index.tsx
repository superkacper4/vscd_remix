import { Link } from "@remix-run/react";
import Nav from "~/components/Nav";

import { useOptionalUser } from "~/utils";

export default function Index() {
  const user = useOptionalUser();
  return (
    <>
    <Nav/>
    <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">

    {user ?
        <div className="mx-auto mt-16 max-w-7xl text-center">
          <Link
            to="/posts"
            className="text-xl text-blue-600 underline"
            >
              Blog Posts
          </Link>
        </div>
    : null}



    </main>
    </>
  );
}
