import { Link } from "@remix-run/react";
import Nav from "~/components/Nav";

import { useOptionalUser } from "~/utils";
import MainPageUnlogged from "~/views/MainPageUnlogged";

export default function Index() {
  const user = useOptionalUser();
  return (
    <>
    <Nav/>
    <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
    <MainPageUnlogged/>


    </main>
    </>
  );
}
