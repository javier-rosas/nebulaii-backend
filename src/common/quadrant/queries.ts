import axios from "axios";
import {
  QDRANT_URL,
  QDRANT_COLLECTION_NAME,
  QDRANT_API_KEY,
} from "../../common/constants";
import { Point } from "../types/Point";

const HEADERS = {
  "Content-Type": "application/json",
  "api-key": QDRANT_API_KEY,
};

export const putPointsInQdrant = async (points: {
  points: Point[];
}): Promise<void> => {
  try {
    const response = await axios.put(
      `${QDRANT_URL}/collections/${QDRANT_COLLECTION_NAME}/points?wait=true`,
      points,
      { headers: HEADERS }
    );

    // console.log("response", response.data);
    if (response.data.status !== "ok") {
      throw new Error("Failed to insert points to Qdrant");
    }
  } catch (error) {
    console.error("Error while inserting points to Qdrant:", error);
    throw error;
  }
};

export const searchPointsInQdrant = async (
  userEmail: string,
  vector: number[],
  limit: number = 3
) => {
  try {
    const response = await axios.post(
      `${QDRANT_URL}/collections/${QDRANT_COLLECTION_NAME}/points/search`,
      {
        vector: vector,
        limit: limit,
        filter: {
          should: [
            {
              key: userEmail,
              match: {
                value: 1,
              },
            },
          ],
        },
      },
      { headers: HEADERS }
    );

    if (response.data.status !== "ok") {
      throw new Error("Failed to search points in Qdrant");
    }

    return response.data.result;
  } catch (error) {
    console.error("Error while searching points in Qdrant:", error);
    throw error;
  }
};
