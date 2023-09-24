import mongoose from "mongoose";
import JobModel from "../models/JobModel";

export const createJob = async (userEmail: string, documentName: string) => {
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
    return await JobModel.findOneAndUpdate(
      filterAndObject,
      filterAndObject,
      options
    );
  } catch (err) {
    throw new Error("Error creating or updating a job.");
  }
};

export const updateJobStatus = async (
  userEmail: string,
  documentName: string,
  status: string
) => {
  try {
    return await JobModel.findOneAndUpdate(
      { userEmail, documentName },
      { status },
      { new: true }
    );
  } catch (err) {
    throw new Error("Error updating job status.");
  }
};

export const getJobsByUserEmail = async (userEmail: string) => {
  try {
    return await JobModel.find({ userEmail }).lean();
  } catch (err) {
    throw new Error("Error fetching jobs by user email.");
  }
};

export const getJobByUserEmailAndDocumentName = async (
  userEmail: string,
  documentName: string
) => {
  try {
    return await JobModel.findOne({ userEmail, documentName });
  } catch (err) {
    throw new Error("Error fetching job by user email and document name.");
  }
};

export const deleteJobByUserEmailAndDocumentName = async (
  userEmail: string,
  documentName: string
) => {
  try {
    // Only delete the job if its status is SUCCESS
    const filter = {
      userEmail,
      documentName,
      status: "SUCCESS",
    };
    return await JobModel.findOneAndDelete(filter);
  } catch (err) {
    throw new Error("Error deleting job by user email and document name.");
  }
};

export const getJobStatusAndDeleteJobIfSuccess = async (
  userEmail: string,
  documentName: string
) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const job = await getJobByUserEmailAndDocumentName(userEmail, documentName);
    if (job && job.status === "SUCCESS")
      await deleteJobByUserEmailAndDocumentName(userEmail, documentName);
    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw new Error("Error updating job status and deleting job if success");
  } finally {
    session.endSession();
  }
};
