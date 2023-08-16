import {
  fetchTxtFromS3,
  splitTxtAndProcessChunks,
  createPointFromChunk,
} from "./utils";
import { isExcedesMaxTokens } from "./helpers";
import { putPoints } from "../common/quadrant/queries";

const KEY = "meditations.txt";
const CHUNK_SIZE = 50;

export const main = async (
  userEmail: string,
  documentName: string
): Promise<any> => {
  console.log("Reading the object from S3", KEY);
  try {
    /**
     * TODO: Later on, generate a dynamic key based on user and document info
     * const dynamicKey = `${userEmail}/${documentName}.txt`
     * **/
    const content = await fetchTxtFromS3(KEY);

    if (isExcedesMaxTokens(content)) {
      const points = await splitTxtAndProcessChunks(
        userEmail,
        documentName,
        content
      );
      await processPointsInChunks(points);
    } else {
      const point = await createPointFromChunk(
        content,
        0,
        userEmail,
        documentName,
        1
      );
      await putPoints([point]);
    }

    return content;
  } catch (err) {
    console.error("Error processing file: ", err);
    throw err;
  }
};

// Created a separate function for the chunk processing logic to reduce clutter
const processPointsInChunks = async (points: any[]) => {
  for (let i = 0; i < points.length; i += CHUNK_SIZE) {
    const pointsChunk = points.slice(i, i + CHUNK_SIZE);
    await putPoints(pointsChunk);
  }
};
