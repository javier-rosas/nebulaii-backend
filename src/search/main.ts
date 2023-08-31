import { createResponse } from "../common/utils/createResponse";
import { searchPoints } from "../common/quadrant/queries";
import { fetchEmbedding } from "../common/openai/fetchEmbedding";
import { getChunkByIdUserEmailAndDocumentName } from "../common/mongoose/queries/largeChunk";
import { QdrantSearchResponse } from "../common/types";

const OPEN_AI_API_KEY = process.env.OPEN_AI_API_KEY;

export const main = async (
  userEmail: string,
  documentName: string,
  question: string
): Promise<any> => {
  try {
    const res = await searchSmallChunksInQdrant(
      userEmail,
      documentName,
      question
    );
    const mongoDocuments = await searchMongoDBUsingParentIds(
      res,
      userEmail,
      documentName
    );
    return createResponse(200, mongoDocuments);
  } catch (error) {
    return createResponse(500, { error: "Internal Server Error" });
  }
};

const searchSmallChunksInQdrant = async (
  userEmail: string,
  documentName: string,
  question: string
): Promise<QdrantSearchResponse> => {
  try {
    const embeddingRes = await fetchEmbedding(question, OPEN_AI_API_KEY);
    const vector = embeddingRes?.data[0]?.embedding;
    const res = await searchPoints(userEmail, documentName, vector, 2);
    if (!res || !res.length) return [];
    return res;
  } catch (error) {
    throw new Error(
      `Failed to search points from quadrant. Reason: ${error.message}`
    );
  }
};

const searchMongoDBUsingParentIds = async (
  res: QdrantSearchResponse,
  userEmail: string,
  documentName: string
) => {
  try {
    const parentIds = res.map((item) => item.payload.parentId);
    const documents = [];
    for (const parentId of parentIds) {
      const document = await getChunkByIdUserEmailAndDocumentName(
        parentId as string,
        userEmail,
        documentName
      );
      documents.push(document);
    }
    return documents;
  } catch (error) {
    throw new Error(
      `Failed to fetch documents from MongoDB. Reason: ${error.message}`
    );
  }
};
