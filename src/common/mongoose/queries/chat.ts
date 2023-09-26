import ChatModel from "../models/ChatModel";

export const createOrUpdateChat = async (
  userEmail: string,
  documentName: string,
  chat: []
) => {
  try {
    const filterAndObject = {
      userEmail,
      documentName,
      chat,
    };

    const options = {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
      runValidators: true,
    };

    const chatDocument = await ChatModel.findOneAndUpdate(
      filterAndObject,
      filterAndObject,
      options
    );

    return chatDocument;
  } catch (err) {
    throw new Error("Error creating or updating chat.");
  }
};

export const deleteChat = async (userEmail: string, documentName: string) => {
  return await ChatModel.deleteOne({ userEmail, documentName });
};

export const getChat = async (userEmail: string, documentName: string) => {
  return await ChatModel.findOne({ userEmail, documentName });
};

export const addMessageToChat = async (
  userEmail: string,
  documentName: String,
  message: { isBot: boolean; message: string }
) => {
  return await ChatModel.findOneAndUpdate(
    { userEmail, documentName },
    { $push: { chat: message } },
    { new: true }
  );
};
