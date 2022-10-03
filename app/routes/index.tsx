import { LinksFunction } from "@remix-run/node";
import Nav, { navLinks } from "~/components/Nav";
import MainPage, { mainPageLinks } from "~/views/MainPage";


export const links: LinksFunction = () => {
return [...mainPageLinks(), ...navLinks()];
}

export default function Index() {
  return (
    <>
    <Nav/>
    <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
    <MainPage/>


    </main>
    </>
  );
}
