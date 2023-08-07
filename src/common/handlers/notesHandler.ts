import { createResponse } from "../utils/createResponse";
import {
  getNotesByUserEmail,
  getNoteByUserEmailAndFilename,
} from "../daos/notesDao";

export const getNotesByUserEmailHandler = async (event: any) => {
  try {
    const userEmail = event.pathParameters.userEmail;
    const notes = await getNotesByUserEmail(userEmail);
    return createResponse(200, notes);
  } catch (error: any) {
    const errorMessage = error.message || "Internal server error";
    return createResponse(500, { error: errorMessage });
  }
};

export const getNoteByUserEmailAndFilenameHandler = async (event: any) => {
  try {
    const userEmail = event.pathParameters.userEmail;
    const filename = event.pathParameters.filename;
    const notes = await getNoteByUserEmailAndFilename(userEmail, filename);
    return createResponse(200, notes);
  } catch (error: any) {
    const errorMessage = error.message || "Internal server error";
    return createResponse(500, { error: errorMessage });
  }
};
