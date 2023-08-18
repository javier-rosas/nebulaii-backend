import { v4 as uuidv4 } from "uuid";
import { fetchEmbedding } from "../common/openai/fetchEmbedding";
import { Point } from "../common/types/Point";
import { S3 } from "aws-sdk";
import { promises as fs } from "fs";
import { TokenTextSplitter } from "langchain/text_splitter";

const OPEN_AI_API_KEY = process.env.OPEN_AI_API_KEY;
const AWS_BUCKET = process.env.AWS_BUCKET;
const MAX_TOKENS = Number(process.env.MAX_TOKENS);

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

export const fetchTxtFromLocal = async (path: string): Promise<string> => {
  try {
    return await fs.readFile(
      "/Users/javierrosas/Documents/nebulaii-project/nebulaii-backend/src/common/local/meditations.txt",
      "utf-8"
    );
  } catch (err) {
    console.error("Error reading the file", err);
    return "";
  }
};

export const splitTxtAndProcessChunks = async (
  userEmail: string,
  documentName: string,
  content: string
): Promise<Point[]> => {
  try {
    const splitter = new TokenTextSplitter({
      chunkSize: MAX_TOKENS,
      chunkOverlap: 0,
    });

    const chunks = await splitter.splitText(content);
    const totalPageCount = chunks.length;

    const points = await Promise.all(
      chunks.map((chunk, index) =>
        createPointFromChunk(
          chunk,
          index,
          userEmail,
          documentName,
          totalPageCount
        )
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
  chunk: string,
  index: number,
  userEmail: string,
  documentName: string,
  totalPageCount: number
): Promise<Point> => {
  const res = await fetchEmbedding(chunk, OPEN_AI_API_KEY);
  const vector = res?.data[0]?.embedding;

  return {
    id: uuidv4(),
    vector,
    payload: {
      userEmail,
      documentName,
      text: chunk,
      pageNumber: index + 1,
      totalPageCount,
    },
  };
};
