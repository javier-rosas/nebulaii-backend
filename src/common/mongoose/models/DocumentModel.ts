import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true },
    documentName: { type: String, required: true },
    description: { type: String, required: true },
    dateAdded: { type: Date, default: Date.now, required: true },
  },
  { collection: "documents" }
);

const DocumentModel = mongoose.model("DocumentModel", documentSchema);
export default DocumentModel;
