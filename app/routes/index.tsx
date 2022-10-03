import { LinksFunction } from "@remix-run/node";
import Nav from "~/components/Nav";
import MainPage, { mainPageLinks } from "~/views/MainPage";


export const links: LinksFunction = () => {
return [...mainPageLinks()];
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
