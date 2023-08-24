import { v4 as uuidv4 } from "uuid";
import { fetchEmbedding } from "../common/openai/fetchEmbedding";
import { Point, Chunk } from "../common/types";
import { S3 } from "aws-sdk";
import { TokenTextSplitter } from "langchain/text_splitter";

const OPEN_AI_API_KEY = process.env.OPEN_AI_API_KEY;
const AWS_BUCKET = process.env.AWS_BUCKET;
const PARENT_MAX_TOKENS = Number(process.env.PARENT_MAX_TOKENS);
const CHILD_MAX_TOKENS = Number(process.env.CHILD_MAX_TOKENS);

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

const splitIntoLargeChunks = async (content: string): Promise<string[]> => {
  const splitter = new TokenTextSplitter({
    chunkSize: PARENT_MAX_TOKENS,
    chunkOverlap: 0,
  });
  const chunks = await splitter.splitText(content);
  return chunks;
};

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

const splitTextIntoChunks = async (content: string): Promise<Chunk[]> => {
  const largeChunks = await splitIntoLargeChunks(content);
  const result: Chunk[] = [];
  for (let i = 0; i < largeChunks.length; i++) {
    const largeChunk = largeChunks[i];
    const parentId = uuidv4();
    const smallChunks = await splitIntoSmallChunks(largeChunk, parentId);
    result.push(...smallChunks);
  }
  return result;
};

export const splitTxtAndProcessChunks = async (
  userEmail: string,
  documentName: string,
  content: string
): Promise<Point[]> => {
  try {
    const smallChunks = await splitTextIntoChunks(content);
    const points = await Promise.all(
      smallChunks.map((chunk: Chunk) =>
        createPointFromChunk(chunk, userEmail, documentName)
      )
    );
    return points;
  } catch (error) {
    console.error(
      "Error while splitting content and processing chunks:",
      error
    );
    throw error;
  }
};

export const createPointFromChunk = async (
  chunk: Chunk,
  userEmail: string,
  documentName: string
): Promise<Point> => {
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
};
