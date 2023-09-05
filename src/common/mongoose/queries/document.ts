import DocumentModel from "../models/DocumentModel";
import LargeChunkModel from "../models/LargeChunkModel";
import mongoose from "mongoose";

export const createOrUpdateDocument = async (
  userEmail: string,
  documentName: string
) => {
  try {
    const filterAndObject = {
      userEmail,
      documentName,
    };
    const options = {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
      runValidators: true,
    };
    const documentMongooseModel = await DocumentModel.findOneAndUpdate(
      filterAndObject,
      filterAndObject,
      options
    );
    return documentMongooseModel;
  } catch (err) {
    throw new Error("Error creating or updating document.");
  }
};

export const getDocumentsByUserEmail = async (userEmail: string) => {
  try {
    console.log("HEREEEE  4 --- ", userEmail);
    const document = await DocumentModel.find({ userEmail }).lean();
    console.log("HEREEEE  5 --- ", document);
    return document;
  } catch (err) {
    throw new Error("Error getting documents by user email");
  }
};

export const getDocumentByUserEmailAndDocumentName = async (
  userEmail: string,
  documentName: string
) => {
  try {
    const document = await DocumentModel.findOne({ userEmail, documentName });
    return document;
  } catch (err) {
    throw new Error("Error getting document by user email and documentname");
  }
};

export const deleteDocumentByUserEmailAndDocumentName = async (
  userEmail: string,
  documentName: string
) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    await DocumentModel.findOneAndDelete({ userEmail, documentName });
    await LargeChunkModel.deleteMany({ userEmail, documentName });
    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw new Error(
      "Error deleting document from MongoDB by user email and documentname"
    );
  } finally {
    session.endSession();
  }
};
