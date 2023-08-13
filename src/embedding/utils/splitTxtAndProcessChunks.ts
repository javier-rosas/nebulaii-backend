import { MAX_TOKENS, OPEN_AI_API_KEY } from "@/constants";
import { TokenTextSplitter } from "langchain/text_splitter";
import { getEmbedding } from "@/utils/fetchEmbedding";
import { Point } from "@/types/Point";

export const splitTxtAndProcessChunks = async (
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
