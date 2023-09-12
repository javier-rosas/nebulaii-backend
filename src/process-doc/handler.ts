import { APIGatewayProxyHandler } from "aws-lambda";
import { createJob } from "../common/mongoose/queries/job";
import { createResponse } from "../common/utils/createResponse";
import { main } from "./main";
import middy from "middy";
import { mongooseConnect } from "../common/mongoose/mongooseConnect";
import { verifyTokenMiddleware } from "../common/utils/verifyTokenMiddleware";

const JWT_SECRET = process.env.JWT_SECRET;

// Handler for the Lambda function.
async function handleMainEvent(event: any) {
  const userEmail = event.pathParameters.userEmail;
  const documentName = event.pathParameters.documentName;
  const job = await createJob(userEmail, documentName);
  await main(userEmail, documentName);
  return createResponse(202, job);
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
