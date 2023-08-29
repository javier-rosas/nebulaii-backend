import LargeChunkModel from "../models/LargeChunkModel";
import { LargeChunk } from "../../types";
import mongoose from "mongoose";

export const createOrUpdateChunk = async (largeChunk: LargeChunk) => {
  try {
    const filter = {
      userEmail: largeChunk.userEmail,
      documentName: largeChunk.documentName,
    };
    const options = {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
      runValidators: true,
    };
    const documentMongooseModel = await LargeChunkModel.findOneAndUpdate(
      filter,
      largeChunk,
      options
    );
    return documentMongooseModel;
  } catch (err) {
    throw new Error("Error creating or updating document.");
  }
};

export const createOrUpdateChunks = async (largeChunks: LargeChunk[]) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // Get the userEmail and documentName from the first largeChunk
    const { userEmail, documentName } = largeChunks[0];
    await LargeChunkModel.deleteMany({ userEmail, documentName }, { session });
    await LargeChunkModel.insertMany(largeChunks, { session });
    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw new Error("Error creating or updating documents:");
  } finally {
    session.endSession();
  }
};

export const getChunkByUserEmailAndDocumentName = async (
  _id: string,
  userEmail: string,
  documentName: string
) => {
  try {
    const document = await LargeChunkModel.findOne({ userEmail, documentName });
    return document;
  } catch (err) {
    throw new Error("Error getting document by user email and documentname");
  }
};

export const deleteChunkByUserEmailAndDocumentName = async (
  _id: string,
  userEmail: string,
  documentName: string
) => {
  try {
    await LargeChunkModel.findOneAndDelete({ userEmail, documentName });
  } catch (err) {
    console.log("deleteDocumentByUserEmailAnddocumentname", err);
    throw new Error(
      "Error deleting document from MongoDB by user email and documentname"
    );
  }
};
