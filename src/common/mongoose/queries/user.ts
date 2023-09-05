import UserModel from "../models/UserModel";

export const createOrUpdateUser = async (user: any) => {
  try {
    const filter = { email: user.email };
    const update = user;
    const options = { new: true, upsert: true, setDefaultsOnInsert: true };
    console.log("HEREEEE  2 --- ", user);
    const newUser = await UserModel.findOneAndUpdate(filter, update, options);
    console.log("HEREEEE  3 --- ", newUser);
    return newUser;
  } catch (err) {
    throw new Error("Error creating or updating user");
  }
};
