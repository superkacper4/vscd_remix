import { LinksFunction } from "@remix-run/node";
import Nav, { navLinks } from "~/components/Nav";
import MainPage, { mainPageLinks } from "~/views/MainPage";


export const links: LinksFunction = () => {
return [...mainPageLinks(), ...navLinks()];
}

export default function Index() {
  return (
    <MainPage/>
  );
}
