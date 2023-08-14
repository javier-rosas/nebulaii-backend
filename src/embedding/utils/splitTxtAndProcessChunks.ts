import { MAX_TOKENS, OPEN_AI_API_KEY } from "../../common/constants";
import { TokenTextSplitter } from "langchain/text_splitter";
import { fetchEmbedding } from "../utils/fetchEmbedding";
import { Point } from "../types/Point";
import { v4 as uuidv4 } from "uuid";
import { putPointsInQdrant } from "../utils/putPointsInQdrant";

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
    const totalPageCount = chunks.length;
    for (let index = 0; index < totalPageCount; index++) {
      const chunk = chunks[index];
      // embed using open ai api
      const res = await fetchEmbedding(chunk, OPEN_AI_API_KEY);
      const vector = res?.data[0]?.embedding;
      /**
       * TODO:  create point
       **/

      const point: Point = {
        id: uuidv4(),
        vector,
        payload: {
          userEmail: "javix98@gmail.com",
          text: chunk,
          pageNumber: index + 1,
          totalPageCount,
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
