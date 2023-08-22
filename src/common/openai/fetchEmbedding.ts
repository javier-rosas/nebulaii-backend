import axios from "axios";

const OPEN_AI_EMBEDDINGS_ENDPOINT = process.env.OPEN_AI_EMBEDDINGS_ENDPOINT;
const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL;

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
    if (error.response && error.response.data) {
      console.error("OpenAI error details:", error.response.data);
    }
    throw error;
  }
};
