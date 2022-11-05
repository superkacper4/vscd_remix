import type { Commit, File } from "@prisma/client";
import { connect } from "http2";
import { url } from "inspector";
import { prisma } from "~/db.server";

import aws from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";

import { S3Client } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import { Upload } from "@aws-sdk/lib-storage";
import type { UploadHandler } from "@remix-run/node";

const {
  AWS_BUCKET_NAME,
  AWS_KEY_ID,
  AWS_SECRET_KEY,
}: {
  AWS_BUCKET_NAME: string;
  AWS_KEY_ID: string;
  AWS_SECRET_KEY: string;
} = process.env;

export async function getFiles({ id }: { id: string[] }) {
  return prisma.file.findMany({
    where: { id: { in: id } },
    // orderBy: { updatedAt: "desc" },
  });
}

export async function createFile(file: {
  name: string;
  id: string;
  content: any;
  commitId: string;
}) {
  // AWS connection
  const filePath = await uploadHandler({
    stream: file.content,
    filename: `${file.commitId}/${file.name}`,
  });

  // Prisma DB
  return prisma.file.create({
    data: {
      name: file.name,
      id: file.id,
      path: filePath,
    },
  });
}

const storage = new S3Client({
  credentials: {
    accessKeyId: AWS_KEY_ID,
    secretAccessKey: AWS_SECRET_KEY,
  },

  // This is only needed for the AWS SDK and it must be set to their region
  region: "eu-central-1",
});

export async function uploadStreamToSpaces(stream: string, filename: string) {
  console.log("uploadStream");
  return new Upload({
    client: storage,
    leavePartsOnError: false,
    params: {
      Bucket: AWS_BUCKET_NAME,
      Key: filename,
      Body: stream,
    },
  }).done();
}

export const uploadHandler = async ({
  stream,
  filename,
}: {
  stream: string;
  filename: string;
}) => {
  const upload = await uploadStreamToSpaces(stream, filename);

  const fileLocation = upload.Location;

  if (upload.$metadata.httpStatusCode === 200) {
    return fileLocation;
  }

  return "";
};
