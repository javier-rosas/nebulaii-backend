import middy from "middy";
import { verifyTokenMiddleware } from "../common/utils/verifyTokenMiddleware";
import { APIGatewayProxyHandler } from "aws-lambda";
import { main } from "./main";
import { createResponse } from "../common/utils/createResponse";
import { mongooseConnect } from "../common/mongoose/mongooseConnect";

const JWT_SECRET = process.env.JWT_SECRET;

// Handler for the Lambda function.
async function handleMainEvent(event: any) {
  const userEmail = event.pathParameters.userEmail;
  const documentName = event.pathParameters.documentName;
  return await main(userEmail, documentName);
}

// Lambda function handler
export const mainHandler: APIGatewayProxyHandler = async (event: any) => {
  try {
    await mongooseConnect();
    switch (event.routeKey) {
      case "GET /users/{userEmail}/documents/{documentName}/process-doc":
        return await handleMainEvent(event);
      default:
        return createResponse(404, { error: "Not Found" });
    }
  } catch (error) {
    return createResponse(500, { error: "Internal Server Error" });
  }
};

// Lambda function handler with middleware
export const handler = middy(mainHandler).use(
  verifyTokenMiddleware({ secret: JWT_SECRET })
);
