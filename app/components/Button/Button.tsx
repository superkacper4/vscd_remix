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
    <div className={`button ${fixed ? "button-fixed" : "button-static"}`}>
      <Link to={url}>{label}</Link>
    </div>
  );
};

export default Button;
