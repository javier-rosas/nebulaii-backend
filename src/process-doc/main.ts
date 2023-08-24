import {
  fetchTxtFromS3,
  splitTxtAndProcessChunks,
  createPointFromChunk,
} from "./helpers";
import { isExcedesMaxTokens } from "./utils";
import { putPoints } from "../common/quadrant/queries";
import { Chunk } from "../common/types";
import { createResponse } from "../common/utils/createResponse";
import { Point } from "../common/types";

const CHUNK_SIZE = 50;

export const main = async (
  userEmail: string,
  documentName: string
): Promise<any> => {
  try {
    const bucketKey = `${userEmail}/${documentName}`;
    console.log("Reading the object from S3", bucketKey);
    const content = await fetchTxtFromS3(bucketKey);
    if (isExcedesMaxTokens(content)) {
      // If the document is too large, split it into chunks and process each chunk
      const points = await splitTxtAndProcessChunks(
        userEmail,
        documentName,
        content
      );
      await putPointsInChunks(points);
    } else {
      const chunk: Chunk = {
        content,
      };
      // If the document is small enough, just process it as a single chunk
      const point = await createPointFromChunk(chunk, userEmail, documentName);
      await putPoints([point]);
    }
    return createResponse(200, { message: "Success" });
  } catch (err) {
    console.error("Error processing file: ", err);
    throw err;
  }
};

// Created a separate function for the chunk processing logic to reduce clutter
const putPointsInChunks = async (points: Point[]) => {
  for (let i = 0; i < points.length; i += CHUNK_SIZE) {
    const pointsChunk = points.slice(i, i + CHUNK_SIZE);
    await putPoints(pointsChunk);
  }
};
