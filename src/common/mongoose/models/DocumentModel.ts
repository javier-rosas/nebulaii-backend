import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true },
    documentName: { type: String, required: true },
    description: { type: String, required: false },
    dateAdded: { type: Date, default: Date.now, required: false },
  },
  { collection: "documents" }
);

const DocumentModel = mongoose.model("DocumentModel", documentSchema);
export default DocumentModel;
