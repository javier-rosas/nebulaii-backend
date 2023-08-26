import mongoose from "mongoose";

const largeChunkSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    userEmail: { type: String, required: true },
    documentName: { type: String, required: true },
    text: { type: String, required: true },
  },
  { collection: "large_chunks" }
);

const LargeChunkModel = mongoose.model("LargeChunkModel", largeChunkSchema);
export default LargeChunkModel;
