import type { Post, File, Commit, User } from "@prisma/client";
import { Form } from "@remix-run/react";
import type { ActionFunction, LinksFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { useState } from "react";
import CommitSelector from "~/components/CommitSelector";
import Nav from "~/components/Nav";
import { createCommit, getPreviousCommit } from "~/models/commit.server";
import { downloadFileFromS3, getFiles } from "~/models/file.server";
import {
  createFilesOnCommits,
  getFilesOnCommits,
} from "~/models/filesOnCommits.server";
import { requireUserId } from "~/session.server";
import styles from "./PostPage.css";
import invariant from "tiny-invariant";
import { createPostsOnUsers } from "~/models/postsOnUsers.server";
import Button from "~/components/Button";
import FilesPage, { filesPageAction } from "./nestedPages/FilesPage";
import CommitsPage from "./nestedPages/CommitsPage";
import ProperitesPage, {
  propertiesPageAction,
} from "./nestedPages/ProperitesPage";

export const postPageLinks: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export const postPageAction: ActionFunction = async ({ request, params }) => {
  await filesPageAction({ request, params });
  await propertiesPageAction({ request, params });
};

const PostPage = ({
  post,
  files,
  commit,
  user,
  commits,
  isNewestCommit,
}: {
  post: Post;
  files: File[] | undefined;
  commit: Commit | undefined;
  user: User | undefined;
  commits: Commit[] | undefined;
  isNewestCommit: Boolean;
}) => {
  return (
    <main className="post-bg">
      <Nav title={post.title} linkTo="/posts" />
      <Button url="new" label="+ New Commit" fixed />

      <div className="post-bg-wrapper">
        <div className="post-bg-content">
          <h1 className="my-6 border-b-2 text-center text-3xl">{post.slug}</h1>
          <div className="commitInfoWrapper">
            <h3 className="h3">{user?.email}</h3>
            <p className="p">{commit?.message}</p>
          </div>
          <FilesPage isNewestCommit={isNewestCommit} files={files} />
          <CommitsPage commits={commits} />
          <ProperitesPage />
        </div>
      </div>
    </main>
  );
};

export default PostPage;
