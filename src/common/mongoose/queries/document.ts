import DocumentModel from "../models/DocumentModel";

export const createOrUpdateDocument = async (documentObj: any) => {
  try {
    const filter = {
      userEmail: documentObj.userEmail,
      documentname: documentObj.documentname,
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
  documentname: string
) => {
  try {
    const document = await DocumentModel.findOne({ userEmail, documentname });
    return document;
  } catch (err) {
    throw new Error("Error getting document by user email and documentname");
  }
};

export const deleteDocumentByUserEmailAndDocumentName = async (
  userEmail: string,
  documentname: string
) => {
  try {
    await DocumentModel.findOneAndDelete({ userEmail, documentname });
  } catch (err) {
    console.log("deleteDocumentByUserEmailAnddocumentname", err);
    throw new Error(
      "Error deleting document from MongoDB by user email and documentname"
    );
  }
};
