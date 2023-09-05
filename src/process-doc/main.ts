import { Chunk, Point } from "../common/types";
import {
  createPointFromChunk,
  fetchTxtFromS3,
  preprocessTxt,
  splitTxtAndProcessChunks,
} from "./helpers";
import { deletePoints, putPoints } from "../common/quadrant/queries";

import { createOrUpdateChunk } from "../common/mongoose/queries/largeChunk";
import { createResponse } from "../common/utils/createResponse";
import { isExcedesMaxTokens } from "./utils";
import { v4 as uuidv4 } from "uuid";

const CHUNK_SIZE = 50;

// Main function that is called by the Lambda.
export const main = async (
  userEmail: string,
  documentName: string
): Promise<any> => {
  try {
    const bucketKey = `${userEmail}/${documentName}`;
    const rawContent = await fetchTxtFromS3(bucketKey);
    const preprocessedContent = preprocessTxt(rawContent);
    await deletePoints(userEmail, documentName);
    if (isExcedesMaxTokens(preprocessedContent)) {
      await processLargeDocument(userEmail, documentName, preprocessedContent);
    } else {
      await processSmallDocument(userEmail, documentName, preprocessedContent);
    }
    return createResponse(200, { message: "Success" });
  } catch (err) {
    console.error("Error processing file: ", err);
    throw err;
  }
};

// Splits the content into large and small chunks, and converts each small chunk into a point.
const processLargeDocument = async (
  userEmail: string,
  documentName: string,
  content: string
) => {
  const points = await splitTxtAndProcessChunks(
    userEmail,
    documentName,
    content
  );
  await putPointsInChunks(points);
};

// Creates a single point from the entire content.
const processSmallDocument = async (
  userEmail: string,
  documentName: string,
  content: string
) => {
  const chunk: Chunk = {
    content,
  };
  await createOrUpdateChunk({
    _id: uuidv4(),
    userEmail,
    documentName,
    text: content,
  });
  const point = await createPointFromChunk(chunk, userEmail, documentName);
  await putPoints([point]);
};

// Splits the points into chunks of 50, and puts them into Quadrant.
const putPointsInChunks = async (points: Point[]) => {
  for (let i = 0; i < points.length; i += CHUNK_SIZE) {
    const pointsChunk = points.slice(i, i + CHUNK_SIZE);
    await putPoints(pointsChunk);
  }
};
