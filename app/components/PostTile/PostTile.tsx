import { Link } from "@remix-run/react";
import type { LinksFunction } from "@remix-run/server-runtime";
import styles from "./PostTile.css";

export const postTileLinks: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

const PostTile = ({
  title,
  slug,
  linkTo,
  creatorUser,
}: {
  title: string;
  slug: string;
  linkTo: string;
  creatorUser?: string;
}) => {
  const length = 25;

  const generateSubTitle = () => {
    if (slug.length >= length) {
      return slug.substring(0, length).concat("...");
    }
    return slug;
  };

  return (
    <div className="postTile">
      <Link to={linkTo}>
        <h3 className="h2">{title}</h3>
        <p className="p">{generateSubTitle()}</p>
        <p className="p">{creatorUser}</p>
      </Link>
    </div>
  );
};

export default PostTile;
