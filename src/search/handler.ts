import {
  addMessageToChat,
  createOrUpdateChat,
  getChat,
} from "../common/mongoose/queries/chat";

import { APIGatewayProxyHandler } from "aws-lambda";
import middy from "middy";
import { mongooseConnect } from "../common/mongoose/mongooseConnect";
import { createResponse } from "../common/utils/createResponse";
import { verifyTokenMiddleware } from "../common/utils/verifyTokenMiddleware";
import { main } from "./main";

const JWT_SECRET = process.env.JWT_SECRET;

// Handler for the search Lambda function.
async function handleSearch(event: any) {
  const userEmail = event.pathParameters.userEmail;
  const documentName = event.pathParameters.documentName;
  const body = JSON.parse(event.body);
  const { question } = body as { question: string };
  return await main(userEmail, documentName, question);
}

// Handle GET request to fetch chat by user email and document name
async function handleGetChat(event: any) {
  const userEmail = event.pathParameters.userEmail;
  const documentName = event.pathParameters.documentName;
  const chat = await getChat(userEmail, documentName);
  return createResponse(200, chat);
}

// Handle PUT request to create or update chat by user email and document name
async function handleCreatOrUpdateChat(event: any) {
  const body = JSON.parse(event.body);
  const { userEmail, documentName, chat } = body;
  const res = await createOrUpdateChat(userEmail, documentName, chat);
  return createResponse(200, res);
}

async function handleAddMessageToChat(event: any) {
  const body = JSON.parse(event.body);
  const { userEmail, documentName, message } = body;
  const res = await addMessageToChat(userEmail, documentName, message);
  console.log(res);
  return createResponse(200, res);
}

// Lambda function handler
export const mainHandler: APIGatewayProxyHandler = async (
  event: any,
  context: any
) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await mongooseConnect();
    switch (event.routeKey) {
      case "POST /users/{userEmail}/documents/{documentName}/search":
        return await handleSearch(event);
      case "GET /users/{userEmail}/chats/{documentName}":
        return await handleGetChat(event);
      case "PUT /chats":
        return await handleCreatOrUpdateChat(event);
      case "POST /chats":
        return await handleAddMessageToChat(event);
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
