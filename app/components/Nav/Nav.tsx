import type { LinksFunction } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import { useOptionalUser } from "~/utils";
import styles from "./Nav.css";

export const navLinks: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

const Nav = ({
  mainPage,
  title,
  linkTo,
}: {
  mainPage?: boolean;
  title?: string;
  linkTo?: string;
}) => {
  const user = useOptionalUser();

  return (
    <nav
      className="nav fixed"
      style={{
        position: mainPage ? "fixed" : "relative",
      }}
    >
      {!mainPage && linkTo ? <Link to={linkTo}>⬅️ Back</Link> : null}
      <p>{title ? title : "Version System Control of Documentation"}</p>
      <div>
        {user ? (
          <div>
            <Form action="/logout" method="post">
              <button
                type="submit"
                className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
              >
                Logout
              </button>
            </Form>
          </div>
        ) : null}
      </div>
    </nav>
  );
};

export default Nav;
