import type { File } from "@prisma/client";
import { connect } from "http2";
import { url } from "inspector";
import { prisma } from "~/db.server";

export async function createFiles(filesArr: {
  filesArr: {
    path: string;
    id: string;
  }[];
}) {
  return prisma.file.createMany({
    data: filesArr.map((file) => ({
      id: file.id,
      path: file.path,
    })),
  });

  //   return await this.prisma.$transaction(
  //     filesArr.map((file) =>
  //       prisma.file.create({
  //         data: {
  //           path: file.path,
  //         },
  //       })
  //     )
  //   );
}

// data format ->
// data = [{
//     path: customUrl,
// },{...}]
