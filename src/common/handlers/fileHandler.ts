import { createResponse } from "../utils/createResponse";
import {
  getFilesByUserEmail,
  getFileByUserEmailAndFilename,
  deleteFileByUserEmailAndFilename,
} from "../mongoose/queries/file";

export const getFilesByUserEmailHandler = async (event: any) => {
  try {
    const userEmail = event.pathParameters.userEmail;
    const files = await getFilesByUserEmail(userEmail);
    return createResponse(200, files);
  } catch (error: any) {
    const errorMessage = error.message || "Internal server error";
    return createResponse(500, { error: errorMessage });
  }
};

export const getFileByUserEmailAndFilenameHandler = async (event: any) => {
  try {
    const userEmail = event.pathParameters.userEmail;
    const filename = event.pathParameters.filename;
    const file = await getFileByUserEmailAndFilename(userEmail, filename);
    return createResponse(200, file);
  } catch (error: any) {
    const errorMessage = error.message || "Internal server error";
    return createResponse(500, { error: errorMessage });
  }
};

export const deleteFileByUserEmailAndFilenameHandler = async (event: any) => {
  try {
    const userEmail = event.pathParameters.userEmail;
    const filename = event.pathParameters.filename;
    const file = await deleteFileByUserEmailAndFilename(userEmail, filename);
    return createResponse(200, file);
  } catch (error: any) {
    const errorMessage = error.message || "Internal server error";
    return createResponse(500, { error: errorMessage });
  }
};
