import middy from "middy";
import { mongooseConnect } from "../common/mongoose/mongooseConnect";
import { createOrUpdateUser } from "../common/mongoose/queries/user";
import { getFilesByUserEmail } from "../common/mongoose/queries/file";
import { createResponse } from "../common/utils/createResponse";
import { verifyTokenMiddleware } from "../common/utils/verifyTokenMiddleware";

const JWT_SECRET = process.env.JWT_SECRET;

// Handle POST request for creating or updating user
async function handleCreateOrUpdateUser(event: any) {
  const user = JSON.parse(event.body);
  return await createOrUpdateUser(user);
}

// Handle GET request to fetch files by user email
async function handleGetFilesByUserEmail(event: any) {
  const userEmail = event.pathParameters.userEmail;
  return await getFilesByUserEmail(userEmail);
}

const mainHandler = async (event: any): Promise<any> => {
  try {
    await mongooseConnect();

    switch (event.routeKey) {
      case "POST /mongo":
        return await handleCreateOrUpdateUser(event);
      case "GET /mongo/{userEmail}/files":
        return await handleGetFilesByUserEmail(event);
      default:
        return createResponse(404, { error: "Not Found" });
    }
  } catch (e) {
    console.error(e);
    return createResponse(500, { error: "Internal Server Error" });
  }
};

export const handler = middy(mainHandler).use(
  verifyTokenMiddleware({ secret: JWT_SECRET })
);
