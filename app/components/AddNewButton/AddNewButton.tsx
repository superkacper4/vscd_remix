import { Link } from "@remix-run/react";
import type { LinksFunction } from "@remix-run/server-runtime";
import styles from "./AddNewButton.css";

export const addNewButtonLinks: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

const AddNewButton = ({ url, label }: { url: string; label: string }) => {
  return (
    <div className="add-new-button">
      <Link to={url}>{label}</Link>
    </div>
  );
};

export default AddNewButton;
