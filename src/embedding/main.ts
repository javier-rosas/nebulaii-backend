import { fetchEmbedding } from "../common/openai/fetchEmbedding";
import { isExcedesMaxTokens } from "./utils/general";
import { fetchTxtFromS3 } from "./utils/fetchTxtFromS3";
import { fetchTxtFromLocal } from "./utils/fetchTxtFromS3";
import { splitTxtAndProcessChunks } from "./utils/splitTxtAndProcessChunks";
import { putPointsInQdrant } from "../common/quadrant/queries";
import { OPEN_AI_API_KEY } from "../common/constants";

const key = "meditations.txt";

export const main = async (
  userEmail: string,
  documentName: string
): Promise<any> => {
  console.log("Reading the object from S3", key);
  try {
    // const content = await fetchTxtFromS3(key);
    /**
     * TODO: DELETE LATER
     * const key = `${userEmail}/${documentName}.txt`
     */
    const content = await fetchTxtFromLocal(key);
    if (isExcedesMaxTokens(content)) {
      // split content and process in chunks
      const points = await splitTxtAndProcessChunks(userEmail, content);
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
