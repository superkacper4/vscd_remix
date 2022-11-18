import type { Commit } from "@prisma/client";
import CommitSelector from "~/components/CommitSelector";

const CommitsPage = ({ commits }: { commits: Commit[] | undefined }) => {
  return (
    <div>
      <CommitSelector commits={commits} />
    </div>
  );
};

export default CommitsPage;
