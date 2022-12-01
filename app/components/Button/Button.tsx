import { Link } from "@remix-run/react";
import type { LinksFunction } from "@remix-run/server-runtime";
import styles from "./Button.css";

export const buttonLinks: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

const Button = ({
  url,
  label,
  fixed,
}: {
  url: string;
  label: string;
  fixed?: boolean;
}) => {
  return (
    <Link
      to={url}
      className={`button ${fixed ? "button-fixed" : "button-static"}`}
    >
      {label}
    </Link>
  );
};

export default Button;
