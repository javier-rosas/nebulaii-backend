import UserModel from "../models/UserModel";

export const createOrUpdateUser = async (user: any) => {
  try {
    const filter = { email: user.email };
    const update = user;
    const options = { new: true, upsert: true, setDefaultsOnInsert: true };
    const newUser = await UserModel.findOneAndUpdate(filter, update, options);
    return newUser;
  } catch (err) {
    throw new Error("Error creating or updating user");
  }
};
