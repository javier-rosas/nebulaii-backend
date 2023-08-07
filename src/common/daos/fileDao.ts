import mongoose from "mongoose";
import FileModel from "../mongoose/models/FileModel";
import NotesModel from "../mongoose/models/NotesModel";

export const createOrUpdateFile = async (fileObj: any) => {
  try {
    const filter = {
      userEmail: fileObj.userEmail,
      filename: fileObj.filename,
    };
    const options = {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
      runValidators: true,
    };
    const fileMongooseModel = await FileModel.findOneAndUpdate(
      filter,
      fileObj,
      options
    );
    return fileMongooseModel;
  } catch (err) {
    throw new Error("Error creating or updating file.");
  }
};

export const getFilesByUserEmail = async (userEmail: string) => {
  try {
    const file = await FileModel.find({ userEmail });
    return file;
  } catch (err) {
    throw new Error("Error getting files by user email");
  }
};

export const getFileByUserEmailAndFilename = async (
  userEmail: string,
  filename: string
) => {
  try {
    const file = await FileModel.findOne({ userEmail, filename });
    return file;
  } catch (err) {
    throw new Error("Error getting file by user email and filename");
  }
};

export const deleteFileByUserEmailAndFilename = async (
  userEmail: string,
  filename: string
) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      await FileModel.findOneAndDelete({ userEmail, filename }, { session });
      await NotesModel.findOneAndDelete({ userEmail, filename }, { session });
    });
  } catch (err) {
    console.log("deleteFileByUserEmailAndFilename", err);
    throw new Error(
      "Error deleting file from MongoDB by user email and filename"
    );
  } finally {
    session.endSession();
  }
};
