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
const lambda = new Lambda();

// Handler for the start-job function.
async function handleStartJobEvent(event: any) {
  const userEmail = event.pathParameters.userEmail;
  const documentName = event.pathParameters.documentName;
  const job = await createJob(userEmail, documentName);
  // Invoke the processMain Lambda function asynchronously
  lambda.invoke(
    {
      FunctionName: "process-doc",
      InvocationType: "Event",
      Payload: JSON.stringify({ userEmail, documentName }),
    },
    (error, data) => {
      if (error) {
        console.error("Error invoking processMain:", error);
      }
    }
  );
  return createResponse(202, job);
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
export const startJobHandler: APIGatewayProxyHandler = async (event: any) => {
  try {
    await mongooseConnect();
    switch (event.routeKey) {
      case "PUT /users/{userEmail}/jobs/{documentName}/start-job":
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
