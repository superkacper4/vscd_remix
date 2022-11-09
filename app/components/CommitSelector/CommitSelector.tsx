import type { Commit } from "@prisma/client";
import { Link } from "@remix-run/react";
import type { LinksFunction } from "@remix-run/server-runtime";
import styles from "./CommitSelector.css";

export const commitSelectorLinks: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

const CommitSelector = ({ commits }: { commits: Commit[] | undefined }) => {
  return (
    <div className="commitSelector">
      {commits?.map((commit) => {
        return (
          <p key={commit.id}>
            <Link to={`?id=${commit.id}`} replace>
              {commit.id}
            </Link>
          </p>
        );
      })}
    </div>
  );
};

export default CommitSelector;
