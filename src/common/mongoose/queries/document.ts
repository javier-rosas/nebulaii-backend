import DocumentModel from "../models/DocumentModel";

export const createOrUpdateDocument = async (documentObj: any) => {
  try {
    const filter = {
      userEmail: documentObj.userEmail,
      documentName: documentObj.documentName,
    };
    const options = {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
      runValidators: true,
    };
    const documentMongooseModel = await DocumentModel.findOneAndUpdate(
      filter,
      documentObj,
      options
    );
    return documentMongooseModel;
  } catch (err) {
    throw new Error("Error creating or updating document.");
  }
};

export const getDocumentsByUserEmail = async (userEmail: string) => {
  try {
    const document = await DocumentModel.find({ userEmail });
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
  try {
    await DocumentModel.findOneAndDelete({ userEmail, documentName });
  } catch (err) {
    console.log("deleteDocumentByUserEmailAnddocumentname", err);
    throw new Error(
      "Error deleting document from MongoDB by user email and documentname"
    );
  }
};
