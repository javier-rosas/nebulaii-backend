import { QdrantClient } from "@qdrant/js-client-rest";
import {
  Point,
  QdrantPutResponse,
  QdrantSearchResponse,
  QdrantDeleteResponse,
} from "../types";

const QDRANT_URL = process.env.QDRANT_URL;
const QDRANT_COLLECTION_NAME = process.env.QDRANT_COLLECTION_NAME;
const QDRANT_API_KEY = process.env.QDRANT_API_KEY;

// connect to Qdrant Cloud
const client = new QdrantClient({
  url: QDRANT_URL,
  apiKey: QDRANT_API_KEY,
});

// add points to Qdrant Cloud
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

// delete points from Qdrant Cloud
export const deletePoints = async (
  userEmail: string,
  documentName: string
): Promise<QdrantDeleteResponse> => {
  try {
    const res = await client.delete(QDRANT_COLLECTION_NAME, {
      wait: true,

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
      `Failed to delete points from quadrant. Reason: ${error.message}`
    );
  }
};

// search points from Qdrant Cloud
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
