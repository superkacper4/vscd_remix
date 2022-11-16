import type { LinksFunction } from "@remix-run/node";
import { buttonLinks } from "~/components/Button";
import Nav, { navLinks } from "~/components/Nav";
import MainPage, { mainPageLinks } from "~/views/MainPage";

export const links: LinksFunction = () => {
  return [...mainPageLinks(), ...navLinks(), ...buttonLinks()];
};

export default function Index() {
  return <MainPage />;
}
