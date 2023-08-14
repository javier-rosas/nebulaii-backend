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
