import type { File } from "@prisma/client";
import { connect } from "http2";
import { url } from "inspector";
import { prisma } from "~/db.server";

export async function createFiles(filesArr: {
  filesArr: {
    path: string;
  }[];
}) {
  return prisma.file.createMany({
    data: filesArr.map((file) => ({
      path: file.path,
    })),
  });
}

// data format ->
// data = [{
//     path: customUrl,
// },{...}]
