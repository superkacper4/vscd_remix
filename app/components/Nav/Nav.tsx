import { LinksFunction } from "@remix-run/node";
import { Form, Link } from "@remix-run/react"
import { useOptionalUser } from "~/utils";
import styles from './Nav.css'

export const navLinks: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
}


const Nav = ({ mainPage }:{mainPage?: boolean}) => {
    const user = useOptionalUser();

    return (
        <nav className="fixed nav"
        style={{
          position: mainPage ? "fixed" : "relative",
        }}
        >
          {!mainPage ? 
            <button onClick={() => history.back()}>Go Back</button>
          :null}
            <p>Version System Control of Documentation</p>
            <div >
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
                ) : (
                  <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
                    <Link
                      to="/join"
                      className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-yellow-700 shadow-sm hover:bg-yellow-50 sm:px-8"
                    >
                      Sign up
                    </Link>
                    <Link
                      to="/login"
                      className="flex items-center justify-center rounded-md bg-yellow-500 px-4 py-3 font-medium text-white hover:bg-yellow-600"
                    >
                      Log In
                    </Link>
                  </div>
                )}
              </div>

        </nav>
    )
}

export default Nav