import { Form, useActionData } from "@remix-run/react";
import type {
  ActionFunction,
  LinksFunction,
  UploadHandler,
} from "@remix-run/server-runtime";
import { unstable_parseMultipartFormData } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { createCommit, getPreviousCommit } from "~/models/commit.server";
import { createFile, getFiles } from "~/models/file.server";
import {
  createFilesOnCommits,
  getFilesOnCommits,
} from "~/models/filesOnCommits.server";
import { requireUserId } from "~/session.server";
import { v4 as uuidv4 } from "uuid";
import styles from "./NewCommitPage.css";
import Nav from "~/components/Nav";

export const newCommitPageLinks: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export const newCommitPageAction: ActionFunction = async ({
  request,
  params,
}) => {
  const userId = await requireUserId(request); // get user creating commit
  const commitId = uuidv4(); // genereate commit id

  invariant(params.slug, `params.slug is required`);

  const postSlug = params.slug;

  const generatePreviousCommitFiles = async () => {
    // defining clouseres to save prevoius commit files without global variable
    let files = [];
    const previousCommit = await getPreviousCommit({ postSlug });

    const innerGeneratePreviousCommitFiles = async () => {
      if (previousCommit.length > 0) {
        const filesOnCommits = await getFilesOnCommits({
          commitId: previousCommit[0]?.id,
        });
        const filesIdArray = filesOnCommits?.map((file) => file?.fileId);
        files = await getFiles({ id: filesIdArray });
        // console.log(files);
        return files;
      }
    };
    return innerGeneratePreviousCommitFiles;
  };

  let uploadHandler: UploadHandler = async ({ filename, name, data }) => {
    // handling form post method
    if (filename) {
      //handling file when recived from post method
      const content = await data.next().then((data) => data.value); //get file STREAM
      const filesForPrisma = {
        // prepare file format for prisma DB
        name: filename,
        id: uuidv4(),
        content,
        commitId,
        postSlug,
      };
      // console.log(filesForPrisma);
      const createdFile = await createFile(filesForPrisma); // create files in prisma and AWS
      return JSON.stringify(createdFile);
    }
    if ((name = "message")) {
      //handling message when recived from post method
      const content = await data.next().then((data) => data.value); //get message value
      const message = String.fromCharCode.apply(null, content); // change 8bit format to string
      return message;
    }
  };

  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );

  const message = formData.get("message");
  const stringifiedFiles = formData.getAll("file");

  const files = stringifiedFiles.map((file) => {
    // change each files from JSON.stringify back to objects
    const parsedFile = JSON.parse(file);
    return parsedFile;
  });

  const generetedPreviousCommitFiles = await generatePreviousCommitFiles();
  const previousCommitFiles = await generetedPreviousCommitFiles(); // using clouseres for previous commit files

  const mergeFiles = (primaryArr, secondaryArr) => {
    // merging old files with new ones (merge condition -> file name)
    const concatedArr = primaryArr.concat(secondaryArr);

    const sortedArr = concatedArr.sort(function (a, b) {
      // sort files from oldest to newest
      return new Date(a.createdAt) - new Date(b.createdAt);
    });

    const duplicatFreeObject = sortedArr.reduce(
      // create an object to replace duplicats
      (acc, cur) => ({ ...acc, [cur.name]: cur }),
      {}
    );

    // crate array from duplicats free object
    var duplicatFreeArray = Object.keys(duplicatFreeObject).map(
      (key) => duplicatFreeObject[key]
    );

    const duplicatFreeFilesIds = duplicatFreeArray.map((file) => file.id);

    return duplicatFreeFilesIds;
  };

  const mergedFilesIds = previousCommitFiles
    ? mergeFiles(files, previousCommitFiles)
    : files.map((file) => file.id);

  await createCommit({ postSlug, message, userId, commitId }); // create commit and s3 folder
  await createFilesOnCommits({ commitId, filesId: mergedFilesIds }); // connect commits and files to each other
};

const NewCommitPage = () => {
  const errors = useActionData();

  return (
    <main className="newCommit-bg">
      <Nav title="Create Commit" />
      <div className="newCommit-bg-content">
        <div className="newCommit-bg-wrapper">
          <Form method="post" encType="multipart/form-data">
            <p>
              <label>
                Commit Message:{" "}
                {errors?.message ? (
                  <em className="text-red-600">{errors.message}</em>
                ) : null}
                <input type="text" name="message" />
              </label>
            </p>
            <p>
              <label>
                File
                {errors?.file ? (
                  <em className="text-red-600">{errors.file}</em>
                ) : null}
                <input id="file" type="file" multiple name="file" />
              </label>
            </p>
            <p className="text-right">
              <button
                type="submit"
                className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
              >
                Create Commit
              </button>
            </p>
          </Form>
        </div>
      </div>
    </main>
  );
};
export default NewCommitPage;
