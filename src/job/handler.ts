import {
  deleteJobByUserEmailAndDocumentName,
  getJobByUserEmailAndDocumentName,
} from "../common/mongoose/queries/job";

import { APIGatewayProxyHandler } from "aws-lambda";
import { Lambda } from "aws-sdk";
import { createJob } from "../common/mongoose/queries/job";
import { createResponse } from "../common/utils/createResponse";
import middy from "middy";
import { mongooseConnect } from "../common/mongoose/mongooseConnect";
import { verifyTokenMiddleware } from "../common/utils/verifyTokenMiddleware";

const JWT_SECRET = process.env.JWT_SECRET;
const IS_OFFLINE = process.env.IS_OFFLINE === "true";
if (IS_OFFLINE) console.log("IS_OFFLINE == true");
const lambda = new Lambda({
  endpoint: IS_OFFLINE
    ? "http://localhost:4002"
    : "https://lambda.us-east-1.amazonaws.com",
});

// Handler for the start-job function.
async function handleStartJobEvent(event: any) {
  const userEmail = event.pathParameters.userEmail;
  const documentName = event.pathParameters.documentName;
  const job = await createJob(userEmail, documentName);
  const Payload = JSON.stringify({ userEmail, documentName });
  const params = {
    FunctionName: "nebulaii-backend-dev-process-doc",
    InvocationType: "Event",
    Payload,
  };
  try {
    await lambda.invoke(params).promise();
    return createResponse(202, { message: "Running job.", job });
  } catch (error) {
    console.error("Failed to invoke target lambda:", error?.message);
    return createResponse(500, { message: "Internal Server Error" });
  }
}

// Handle GET request to fetch jobs by user email and document name
async function handleGetJobByUserEmailAndDocumentName(event: any) {
  const userEmail = event.pathParameters.userEmail;
  const documentName = event.pathParameters.documentName;
  const jobs = await getJobByUserEmailAndDocumentName(userEmail, documentName);
  return createResponse(200, jobs);
}

// Handle DELETE request to delete job by user email and document name
async function handleDeleteJobByUserEmailAndDocumentName(event: any) {
  const userEmail = event.pathParameters.userEmail;
  const documentName = event.pathParameters.documentName;
  await deleteJobByUserEmailAndDocumentName(userEmail, documentName);
  return createResponse(200, { message: "Job deleted successfully" });
}

// Lambda function handler for the start-job
export const startJobHandler: APIGatewayProxyHandler = async (
  event: any,
  context: any
) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await mongooseConnect();
    switch (event.routeKey) {
      case "GET /users/{userEmail}/jobs/{documentName}/start-job":
        return await handleStartJobEvent(event);
      case "GET /users/{userEmail}/jobs/{documentName}":
        return await handleGetJobByUserEmailAndDocumentName(event);
      case "DELETE /users/{userEmail}/jobs/{documentName}":
        return await handleDeleteJobByUserEmailAndDocumentName(event);
      default:
        return createResponse(404, { error: "Not Found" });
    }
  } catch (error) {
    return createResponse(500, { error: "Internal Server Error" });
  }
};

// Lambda function handler with middleware for start-job
export const handler = middy(startJobHandler).use(
  verifyTokenMiddleware({ secret: JWT_SECRET })
);
