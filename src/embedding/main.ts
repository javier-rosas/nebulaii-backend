import { getEmbedding } from "./getEmbedding";
import {
  isExcedesMaxTokens,
  splitContentAndProcessChunks,
  fetchContentFromS3,
} from "./utils";
import { OPEN_AI_API_KEY } from "../common/constants";

const key = "meditations.txt";

export const main = async (): Promise<any> => {
  console.log("Reading the object from S3", key);
  try {
    const content = await fetchContentFromS3(key);
    if (isExcedesMaxTokens(content)) {
      // split content and process in chunks
      await splitContentAndProcessChunks(content);
    } else {
      // embed using open ai api
      await getEmbedding(content, OPEN_AI_API_KEY);
    }
    return content;
  } catch (err) {
    console.error("Error processing file: ", err);
    throw err;
  }
};
