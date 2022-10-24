import type { Commit, File } from "@prisma/client";
import { connect } from "http2";
import { url } from "inspector";
import { prisma } from "~/db.server";

import aws from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";

import { S3Client } from "@aws-sdk/client-s3";
import type { Readable } from "stream";
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

export async function createFiles(filesArr: {
  filesArr: {
    path: string;
    id: string;
  }[];
}) {
  uploadHandler({
    stream: filesArr[0].path,
    filename: filesArr[0].id,
  });
  // Prisma DB
  return prisma.file.createMany({
    data: filesArr.map((file) => ({
      id: file.id,
      path: file.path,
    })),
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

export async function uploadStreamToSpaces(stream: Readable, filename: string) {
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

export const uploadHandler: UploadHandler = async ({ stream, filename }) => {
  const upload = await uploadStreamToSpaces(stream, filename);

  console.log(upload);

  if (upload.$metadata.httpStatusCode === 200) {
    return filename;
  }

  return "";
};

// export async function createAWSFiles(filesArr: {
//   filesArr: {
//     path: string;
//     id: string;
//   }[];
// }) {
//   // AWS S3
//   const s3 = new aws.S3({ apiVersion: "2006-03-01" });
//   const upload = multer({
//     storage: multerS3({
//       s3,
//       bucket: "vscd",
//       accessKeyId: AWS_KEY_ID,
//       secretAccessKey: AWS_SECRET_KEY,
//       metadata: (req, file, cb) => {
//         cb(null, { fieldName: file.fieldname });
//       },
//       key: (req, file, cb) => {
//         const ext = path.extname(file.originalname);
//         cb(null, `${filesArr[0]?.id}${ext}`);
//       },
//     }),
//   });

//   upload.single(filesArr[0].path);
// }
