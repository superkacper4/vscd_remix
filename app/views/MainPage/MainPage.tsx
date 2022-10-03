import { LinksFunction } from "@remix-run/node";

import { Link } from "@remix-run/react";
import { useOptionalUser } from "~/utils";
import styles from "./MainPage.css";
// import styles from "~/styles/globals.css";

// styles is now something like /build/global-AE33KB2.css

export const mainPageLinks: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
}

const MainPage = () => {
    const user = useOptionalUser();

    return(
        <section className="w-full min-h-screen text-white main-bg flex items-center justify-center flex-col">
              <h2 className="text-3x px-3 text-center">
              {user ? 
              `Witaj ${user.email}`
              : 
              'Zaloguj się lub zarejestruj, aby korzystać z systemu kontroli wersji'
              }
              </h2>
            <div className="mx-auto mt-16 max-w-7xl text-center">
                {user ? 
                <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
                <Link
                to="/posts"
                className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-yellow-700 shadow-sm hover:bg-yellow-50 sm:px-8"
                >
                  View Repozytories
                </Link>
                  <Link
                  to="/notes"
                  className="flex items-center justify-center rounded-md bg-yellow-500 px-4 py-3 font-medium text-white hover:bg-yellow-600"
                >
                  View Notes
                </Link>
                </div>                
                : 
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
                }
            </div>
        </section>
    )
}

export default MainPage