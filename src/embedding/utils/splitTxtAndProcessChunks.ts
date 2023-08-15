import { MAX_TOKENS, OPEN_AI_API_KEY } from "../../common/constants";
import { TokenTextSplitter } from "langchain/text_splitter";
import { fetchEmbedding } from "../../common/openai/fetchEmbedding";
import { Point } from "../../common/types/Point";
import { v4 as uuidv4 } from "uuid";

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

const createPointFromChunk = async (
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
