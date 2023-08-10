import NotesModel from "../models/NotesModel";

export const createOrUpdateNotes = async (notesObj: any) => {
  try {
    const filter = {
      userEmail: notesObj.userEmail,
      filename: notesObj.filename,
    };
    const options = {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
      runValidators: true,
    };
    const notesMongooseModel = await NotesModel.findOneAndUpdate(
      filter,
      notesObj,
      options
    );
    return notesMongooseModel;
  } catch (err) {
    throw new Error("Error creating or updating notes");
  }
};

export const getNotesByUserEmail = async (userEmail: string) => {
  try {
    const notes = await NotesModel.find({ userEmail });
    return notes;
  } catch (err) {
    throw new Error("Error getting notes by user email");
  }
};

export const getNoteByUserEmailAndFilename = async (
  userEmail: string,
  filename: string
) => {
  try {
    const note = await NotesModel.findOne({
      userEmail,
      filename,
    });
    return note;
  } catch (err) {
    throw new Error("Error getting notes by user email and filename");
  }
};
