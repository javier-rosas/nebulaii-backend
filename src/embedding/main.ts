import { fetchEmbedding } from "./utils/fetchEmbedding";
import { isExcedesMaxTokens } from "./utils/general";
import { fetchContentFromS3 } from "./utils/fetchTxtFromS3";
import { splitTxtAndProcessChunks } from "./utils/splitTxtAndProcessChunks";
import { putPointsInQdrant } from "./utils/putPointsInQdrant";
import { OPEN_AI_API_KEY } from "../common/constants";

const key = "meditations.txt";

export const main = async (): Promise<any> => {
  console.log("Reading the object from S3", key);
  try {
    const content = await fetchContentFromS3(key);
    if (isExcedesMaxTokens(content)) {
      // split content and process in chunks
      const points = await splitTxtAndProcessChunks(content);
      const chunkSize = 50;
      for (let i = 0; i < points.length; i += chunkSize) {
        const chunk = points.slice(i, i + chunkSize);
        await putPointsInQdrant({ points: chunk });
      }
    } else {
      // embed using open ai api
      await fetchEmbedding(content, OPEN_AI_API_KEY);
    }
    return content;
  } catch (err) {
    console.error("Error processing file: ", err);
    throw err;
  }
};
