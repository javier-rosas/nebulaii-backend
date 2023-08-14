import axios from "axios";
import {
  OPEN_AI_EMBEDDINGS_ENDPOINT,
  EMBEDDING_MODEL,
} from "../../common/constants";

export const fetchEmbedding = async (
  inputText: string,
  apiKey: string
): Promise<any> => {
  const endpoint = OPEN_AI_EMBEDDINGS_ENDPOINT;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };
  const data = {
    input: inputText,
    model: EMBEDDING_MODEL,
  };
  try {
    const response = await axios.post(endpoint, data, { headers });
    if (!response.data) throw new Error("No data found in response");
    return response.data;
  } catch (error) {
    console.error("Error fetching embedding:", error);
    throw error;
  }
};
