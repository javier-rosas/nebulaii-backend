import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true },
    documentName: { type: String, required: true },
    dateAdded: { type: Date, default: Date.now, required: false },
    status: {
      type: String,
      required: true,
      enum: ["RUNNING", "FAILED", "SUCCESS"],
      default: "RUNNING",
    },
  },
  { collection: "jobs" }
);

const JobModel = mongoose.model("JobModel", jobSchema);
export default JobModel;
