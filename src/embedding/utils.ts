import { get_encoding } from "@dqbd/tiktoken";
import { MAX_TOKENS, OPEN_AI_API_KEY, AWS_BUCKET } from "./constants";
import { TokenTextSplitter } from "langchain/text_splitter";
import { getEmbedding } from "./getEmbedding";
import { S3 } from "aws-sdk";
import { Point } from "./types/Point";

export const fetchContentFromS3 = async (key: string): Promise<string> => {
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

const countTokens = (content: string): number => {
  const encoding = get_encoding("cl100k_base");
  const numTokens = encoding.encode(content).length;
  encoding.free();
  return numTokens;
};

export const isExcedesMaxTokens = (content: string): boolean => {
  const numTokens = countTokens(content);
  return numTokens > MAX_TOKENS;
};

export const splitContentAndProcessChunks = async (
  content: string
): Promise<any> => {
  const splitter = new TokenTextSplitter({
    chunkSize: MAX_TOKENS,
    chunkOverlap: 0,
  });
  try {
    const points: Point[] = [];
    const chunks = await splitter.splitText(content);
    for (let chunk of chunks) {
      // embed using open ai api
      const res = await getEmbedding(chunk, OPEN_AI_API_KEY);
      const embedding = res?.data[0]?.embedding;
      /**
       * TODO:  create point
       * */
      const point: Point = {
        id: "1",
        vector: embedding,
        payload: {
          userEmail: "javix98@gmail.com",
          textChunk: chunk,
          pageNumber: 1,
          totalPageCount: 1,
        },
      };
      points.push(point);
    }
    return points;
  } catch (error) {
    console.error(
      "Error while splitting content and processing chunks:",
      error
    );
    throw error;
  }
};
