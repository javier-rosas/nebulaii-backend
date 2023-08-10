import { createResponse } from "../utils/createResponse";
import { createOrUpdateUser } from "../mongoose/queries/user";

export const createOrUpdateUserHandler = async (event: any) => {
  try {
    const userJwtDecoded = event.user;
    const user = JSON.parse(event.body);
    if (userJwtDecoded.email !== user.email) {
      throw new Error("Decoded user email and user email in body don't match.");
    }
    const newUser = await createOrUpdateUser(user);
    return createResponse(200, newUser);
  } catch (error: any) {
    const errorMessage = error.message || "Internal server error";
    return createResponse(500, { error: errorMessage });
  }
};
