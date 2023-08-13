import { getEmbedding } from "@/utils/fetchEmbedding";
import { isExcedesMaxTokens } from "@/utils/helpers";
import { fetchContentFromS3 } from "@/utils/fetchTxtFromS3";
import { splitTxtAndProcessChunks } from "@/utils/splitTxtAndProcessChunks";
import { OPEN_AI_API_KEY } from "@/constants";

const key = "meditations.txt";

export const main = async (): Promise<any> => {
  console.log("Reading the object from S3", key);
  try {
    const content = await fetchContentFromS3(key);
    if (isExcedesMaxTokens(content)) {
      // split content and process in chunks
      await splitTxtAndProcessChunks(content);
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
