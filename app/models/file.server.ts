import { prisma } from "~/db.server";

import aws from "aws-sdk";

import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

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
  postSlug: string;
}) {
  const fileKey = `${file.postSlug}/${file.commitId}/${file.name}`;
  // AWS connection
  await uploadHandler({
    stream: file.content,
    filename: fileKey,
  });

  // Prisma DB
  return prisma.file.create({
    data: {
      name: file.name,
      id: file.id,
      path: fileKey,
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

export async function downloadFileFromS3(fileKey: string) {
  aws.config.update({
    accessKeyId: AWS_KEY_ID,
    secretAccessKey: AWS_SECRET_KEY,
    region: "eu-central-1",
  });
  var s3 = new aws.S3();
  var options = {
    Bucket: AWS_BUCKET_NAME,
    // Key: fileKey,
    Key: fileKey,
  };

  // var fileStream = s3.getObject(options).createReadStream();
  const url = s3.getSignedUrl("getObject", options);
  return url; // ten url jest maginczy i scaiga nam plik!!!

  // fileStream.pipe(res);
}

export const deleteFilesFromS3 = ({ postSlug }: { postSlug: string }) => {
  const key = `${postSlug}/`;

  return new Promise((resolve, reject) => {
    // get all keys and delete objects
    const getAndDelete = (ct: string = null) => {
      aws.config.update({
        accessKeyId: AWS_KEY_ID,
        secretAccessKey: AWS_SECRET_KEY,
        region: "eu-central-1",
      });
      var s3 = new aws.S3();
      s3.listObjectsV2({
        Bucket: AWS_BUCKET_NAME,
        MaxKeys: 1000,
        ContinuationToken: ct,
        Prefix: key,
        Delimiter: "",
      })
        .promise()
        .then(async (data) => {
          // params for delete operation
          let params = {
            Bucket: AWS_BUCKET_NAME,
            Delete: { Objects: [] },
          };
          // add keys to Delete Object
          data?.Contents.forEach((content) => {
            params.Delete.Objects.push({ Key: content.Key });
          });
          // delete all keys
          await s3.deleteObjects(params).promise();
          // check if ct is present
          if (data.NextContinuationToken)
            getAndDelete(data.NextContinuationToken);
          else resolve(true);
        })
        .catch((err) => reject(err));
    };

    // init call
    getAndDelete();
  });
};
