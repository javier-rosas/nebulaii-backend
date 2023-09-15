import { Chunk, LargeChunk, Point } from "../common/types";

import { S3 } from "aws-sdk";
import { TokenTextSplitter } from "langchain/text_splitter";
import { createOrUpdateChunks } from "../common/mongoose/queries/largeChunk";
import { fetchEmbedding } from "../common/openai/fetchEmbedding";
import { v4 as uuidv4 } from "uuid";

const OPEN_AI_API_KEY = process.env.OPEN_AI_API_KEY;
const AWS_BUCKET = process.env.AWS_BUCKET;
const PARENT_MAX_TOKENS = Number(process.env.PARENT_MAX_TOKENS);
const CHILD_MAX_TOKENS = Number(process.env.CHILD_MAX_TOKENS);

// Fetches a text file from an AWS S3 bucket.
export const fetchTxtFromS3 = async (key: string): Promise<string> => {
  const s3 = new S3();
  const params: S3.GetObjectRequest = {
    Bucket: AWS_BUCKET,
    Key: key,
  };
  try {
    const response = await s3.getObject(params).promise();
    const body = response.Body;
    if (!body) throw new Error("No body found in S3 response");
    const content = body.toString("utf-8");
    return content;
  } catch (error) {
    console.error("Error while reading the object:", error);
    throw error;
  }
};

// Preprocesses the text by replacing multiple newlines and spaces with single ones.
export const preprocessTxt = (text: string): string => {
  return text
    .replace(/\s*\n\s*/g, "\n") // Replace multiple newlines and spaces around newlines with a single newline
    .replace(/ +/g, " "); // Replace multiple spaces with a single space
};

// Splits the content into large chunks based on the PARENT_MAX_TOKENS.
const splitIntoLargeChunks = async (content: string): Promise<string[]> => {
  const splitter = new TokenTextSplitter({
    chunkSize: PARENT_MAX_TOKENS,
    chunkOverlap: 0,
  });
  const chunks = await splitter.splitText(content);
  return chunks;
};

// Splits a large chunk into smaller chunks based on the CHILD_MAX_TOKENS and assigns the same parent ID to all of them.
const splitIntoSmallChunks = async (
  largeChunk: string,
  parentId: string
): Promise<Chunk[]> => {
  const splitter = new TokenTextSplitter({
    chunkSize: CHILD_MAX_TOKENS,
    chunkOverlap: 0,
  });
  const chunks = await splitter.splitText(largeChunk);
  return chunks.map((chunk) => ({
    content: chunk,
    parentId: parentId,
  }));
};

// Splits the content into large chunks and saves them to MongoDB with a generated parent ID.
const saveLargeChunksToMongoDB = async (
  content: string,
  userEmail: string,
  documentName: string
): Promise<LargeChunk[]> => {
  const largeChunks = await splitIntoLargeChunks(content);
  const largeChunkDocuments: LargeChunk[] = largeChunks.map((largeChunk) => {
    const parentId = uuidv4();
    return {
      _id: parentId,
      userEmail: userEmail,
      documentName: documentName,
      text: largeChunk,
    };
  });
  // Save all the large chunks to MongoDB at once
  await createOrUpdateChunks(largeChunkDocuments);
  return largeChunkDocuments;
};

// Splits the large chunks into smaller chunks, and assigns the same parent ID, userEmail, and documentName to all of them.
const splitTextIntoChunks = async (
  largeChunkDocuments: LargeChunk[]
): Promise<Chunk[]> => {
  const result: Chunk[] = [];
  for (const largeChunkDocument of largeChunkDocuments) {
    const largeChunk = largeChunkDocument.text;
    const parentId = largeChunkDocument._id;
    const smallChunks = await splitIntoSmallChunks(largeChunk, parentId);
    result.push(
      ...smallChunks.map((chunk) => ({
        ...chunk,
        userEmail: largeChunkDocument.userEmail,
        documentName: largeChunkDocument.documentName,
      }))
    );
  }

  return result;
};

// Splits the content into large and small chunks, and converts each small chunk into a point.
export const splitTxtAndProcessChunks = async (
  userEmail: string,
  documentName: string,
  content: string
): Promise<Point[]> => {
  try {
    const largeChunkDocuments = await saveLargeChunksToMongoDB(
      content,
      userEmail,
      documentName
    );
    const smallChunks = await splitTextIntoChunks(largeChunkDocuments);
    const points = await Promise.all(
      smallChunks.map((chunk: Chunk) =>
        createPointFromChunk(chunk, userEmail, documentName)
      )
    );
    return points;
  } catch (error) {
    throw new Error("Error while splitting content and processing chunks");
  }
};

// Fetches the embedding for the chunk content and creates a point object.
export const createPointFromChunk = async (
  chunk: Chunk,
  userEmail: string,
  documentName: string
): Promise<Point> => {
  try {
    const res = await fetchEmbedding(chunk.content, OPEN_AI_API_KEY);
    const vector = res?.data[0]?.embedding;
    return {
      id: uuidv4(),
      vector,
      payload: {
        userEmail,
        documentName,
        text: chunk.content,
        parentId: chunk?.parentId,
      },
    };
  } catch (error) {
    throw new Error("Error creating point from chunk");
  }
};
