import { Link } from "@remix-run/react";
import type { LinksFunction } from "@remix-run/server-runtime";
import styles from "./PostTile.css";

export const postTileLinks: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

const PostTile = ({
  title,
  id,
  linkTo,
  creatorUser,
}: {
  title: string;
  id: string;
  linkTo: string;
  creatorUser?: string;
}) => {
  return (
    <div className="postTile">
      <Link to={linkTo}>
        <h3 className="h2">{title}</h3>
        <p className="p">{id}</p>
        <p className="p">{creatorUser}</p>
      </Link>
    </div>
  );
};

export default PostTile;
