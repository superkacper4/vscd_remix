import { Link } from "@remix-run/react";
import { useOptionalUser } from "~/utils";

const MainPageUnlogged = () => {
    const user = useOptionalUser();

    return(
        <section>
            <div>
                <h2>
                {user ? 
                `Witaj ${user.email}`
                : 
                'Zaloguj się lub zarejestruj, aby korzystać z systemu kontroli wersji'
                }
                </h2>
            </div>
            <div className="mx-auto mt-16 max-w-7xl text-center">
                {user ? 
                <Link
                to="/posts"
                className="text-xl text-blue-600 underline"
                >
                    Repozytoria
                </Link>
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

export default MainPageUnlogged