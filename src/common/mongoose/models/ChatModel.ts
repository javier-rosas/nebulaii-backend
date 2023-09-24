import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    bot: { type: String, required: false },
    user: { type: String, required: false },
  },
  { _id: false }
);

const chatSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true },
    documentName: { type: String, required: true },
    dateAdded: { type: Date, default: Date.now },
    chat: { type: [messageSchema], required: false },
  },
  { collection: "chats", _id: false }
);

const ChatModel = mongoose.model("ChatModel", chatSchema);
export default ChatModel;
