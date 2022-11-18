import type { Commit } from "@prisma/client";
import { Link } from "@remix-run/react";
import type { LinksFunction } from "@remix-run/server-runtime";
import styles from "./CommitsPage.css";

export const commitsPageLinks: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

const CommitsPage = ({ commits }: { commits: Commit[] | undefined }) => {
  return (
    <div className="commitsPage-content">
      {commits?.map((commit) => {
        return (
          <div key={commit.id} className="commitTile">
            <Link to={`?id=${commit.id}`} replace>
              <div className="commitTileContent">
                <p className="commitTileMessage">{commit.message}</p>
                <p className="commitTileId">{commit.id}</p>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default CommitsPage;
