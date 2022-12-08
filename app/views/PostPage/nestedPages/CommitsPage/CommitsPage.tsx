import type { Commit, User } from "@prisma/client";
import { Link } from "@remix-run/react";
import type { LinksFunction } from "@remix-run/server-runtime";
import { cutTimeFromDate } from "helpers/helpers";
import styles from "./CommitsPage.css";

interface CommitType {
  commits: (Commit & {
    user: User;
  })[];
}

export const commitsPageLinks: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

const CommitsPage = ({ commits }: { commits: CommitType | undefined }) => {
  return (
    <div className="commitsPage-content">
      {commits?.map((commit) => {
        return (
          <div
            key={commit.id}
            className={commit.isTag ? "tagTile" : "commitTile"}
          >
            <Link to={`?id=${commit.id}`} replace>
              <div className="commitTileContent">
                <p className="commitTileMain">{commit.message}</p>
                <p className="commitTileSecondary">{commit.user.email}</p>
                <p className="commitTileSecondary">
                  {cutTimeFromDate({ date: commit.createdAt })}
                </p>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default CommitsPage;
