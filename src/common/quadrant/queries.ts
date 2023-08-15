import { QdrantClient } from "@qdrant/js-client-rest";
import {
  QDRANT_URL,
  QDRANT_COLLECTION_NAME,
  QDRANT_API_KEY,
} from "../../common/constants";
import { Point } from "../types/Point";

type QdrantPutResponse = {
  operation_id: number;
  status: "acknowledged" | "completed";
};

type QdrantSearchResponse = {
  id: string | number;
  version: number;
  score: number;
  payload?: Record<string, unknown> | { [key: string]: unknown };
  vector?: number[] | Record<string, unknown> | { [key: string]: number[] };
}[];

// connect to Qdrant Cloud
const client = new QdrantClient({
  url: QDRANT_URL,
  apiKey: QDRANT_API_KEY,
});

export const putPoints = async (
  points: Point[]
): Promise<QdrantPutResponse> => {
  try {
    const res = await client.upsert(QDRANT_COLLECTION_NAME, {
      wait: true,
      points,
    });
    return res;
  } catch (error) {
    throw new Error(
      `Failed to add points to quadrant. Reason: ${error.message}`
    );
  }
};

export const searchPoints = async (
  userEmail: string,
  documentName: string,
  vector: number[],
  limit: number = 3
): Promise<QdrantSearchResponse> => {
  try {
    const res = await client.search(QDRANT_COLLECTION_NAME, {
      vector,
      limit,
      filter: {
        must: [
          {
            key: "userEmail",
            match: {
              value: userEmail,
            },
          },
          {
            key: "documentName",
            match: {
              value: documentName,
            },
          },
        ],
      },
    });
    return res;
  } catch (error) {
    throw new Error(
      `Failed to add points to quadrant. Reason: ${error.message}`
    );
  }
};
