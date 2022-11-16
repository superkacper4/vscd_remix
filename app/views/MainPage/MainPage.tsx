import type { LinksFunction } from "@remix-run/node";

import { Link } from "@remix-run/react";
import Button from "~/components/Button";
import Nav from "~/components/Nav";
import { useOptionalUser } from "~/utils";
import styles from "./MainPage.css";
// import styles from "~/styles/globals.css";

// styles is now something like /build/global-AE33KB2.css

export const mainPageLinks: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

const MainPage = () => {
  const user = useOptionalUser();

  return (
    <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
      <Nav mainPage={true} />
      <section className="main-bg flex min-h-screen w-full flex-col items-center justify-center text-white">
        <h2 className="text-3x px-3 text-center">
          {user
            ? `Hello ${user.email}! 👋`
            : "Hello! Log In or Sign Up to use VSCD 👋"}
        </h2>
        <div className="mx-auto mt-16 max-w-7xl text-center">
          {user ? (
            <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
              <Button url="/posts" label="View Posts" />
              <Button url="/notes" label="View Notes" />
            </div>
          ) : (
            <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
              <Button url="/join" label="Sign up" />
              <Button url="/login" label="Log In" />
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default MainPage;
