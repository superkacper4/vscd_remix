import type { Commit } from "@prisma/client";
import { Link } from "@remix-run/react";

const CommitsPage = ({ commits }: { commits: Commit[] | undefined }) => {
  return (
    <div>
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

export default CommitsPage;
