import type { Post, File, Commit, User, PostsOnUsers } from "@prisma/client";
import type { ActionFunction, LinksFunction } from "@remix-run/server-runtime";
import { useState } from "react";
import Nav from "~/components/Nav";
import styles from "./PostPage.css";
import Button from "~/components/Button";
import FilesPage, { filesPageAction } from "./nestedPages/FilesPage";
import CommitsPage, { commitsPageLinks } from "./nestedPages/CommitsPage";
import ProperitesPage, {
  propertiesPageAction,
} from "./nestedPages/ProperitesPage";

export const postPageLinks: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }, ...commitsPageLinks()];
};

const PostPage = ({
  post,
  files,
  commit,
  user,
  commits,
  isNewestCommit,
  usersOnPosts,
  inputErrors,
}: {
  post: Post;
  files: File[] | undefined;
  commit: Commit | undefined;
  user: User | undefined;
  commits: Commit[] | undefined;
  isNewestCommit: Boolean;
  usersOnPosts: User[];
  inputErrors: {
    parentIdError: String;
    userIdError: String;
  };
}) => {
  const [selectedPage, setSelectedPage] = useState<string>("");

  const pages = [
    { path: "", label: "Files" },
    { path: "commits", label: "Commits" },
    { path: "properties", label: "Properties" },
  ];

  const renderContent = () => {
    switch (selectedPage) {
      case "commits":
        return <CommitsPage commits={commits} />;

      case "properties":
        return (
          <ProperitesPage
            inputErrors={inputErrors}
            post={post}
            usersOnPosts={usersOnPosts}
          />
        );

      default:
        return <FilesPage isNewestCommit={isNewestCommit} files={files} />;
    }
  };

  return (
    <main className="post-bg">
      <Nav title={post.title} linkTo="/posts" />
      <Button url="new" label="+ New Commit/Tag" fixed />

      <div className="post-bg-wrapper">
        <div className="post-bg-content">
          <h1 className="my-6 border-b-2 text-center text-3xl">{post.id}</h1>
          <div className="commitInfoWrapper">
            <h3 className="h3">{user?.email}</h3>
            <p className="p">{commit?.message}</p>
          </div>
          <div className="buttonBar">
            {pages.map((page) => (
              <button
                key={page.path}
                type="button"
                style={{
                  backgroundColor:
                    selectedPage === page.path ? "var(--secondColor)" : "",
                }}
                onClick={() => {
                  setSelectedPage(page.path);
                }}
              >
                {page.label}
              </button>
            ))}
          </div>
          {renderContent()}
        </div>
      </div>
    </main>
  );
};

export default PostPage;
