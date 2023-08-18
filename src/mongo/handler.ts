import middy from "middy";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { mongooseConnect } from "../common/mongoose/mongooseConnect";
import { createOrUpdateUser } from "../common/mongoose/queries/user";
import { getFilesByUserEmail } from "../common/mongoose/queries/file";
import { createResponse } from "../common/utils/createResponse";
import { verifyTokenMiddleware } from "../common/utils/verifyTokenMiddleware";

const JWT_SECRET = process.env.JWT_SECRET;

const mainHandler: APIGatewayProxyHandlerV2 = async (
  event: any
): Promise<any> => {
  try {
    await mongooseConnect();
    switch (event.routeKey) {
      case "POST /mongo":
        const userJwtDecoded = event.user;
        const user = JSON.parse(event.body);
        if (userJwtDecoded.email !== user.email) {
          throw new Error(
            "Decoded user email and user email in body don't match."
          );
        }
        return await createOrUpdateUser(user);
      case "GET /mongo/{userEmail}/files":
        const userEmail = event.pathParameters.userEmail;
        return await getFilesByUserEmail(userEmail);
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
