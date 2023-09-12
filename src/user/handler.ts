import {
  deleteDocumentByUserEmailAndDocumentName,
  getDocumentByUserEmailAndDocumentName,
  getDocumentsByUserEmail,
} from "../common/mongoose/queries/document";

import { createOrUpdateUser } from "../common/mongoose/queries/user";
import { createResponse } from "../common/utils/createResponse";
import { deletePoints } from "../common/quadrant/queries";
import middy from "middy";
import { mongooseConnect } from "../common/mongoose/mongooseConnect";
import { verifyTokenMiddleware } from "../common/utils/verifyTokenMiddleware";

const JWT_SECRET = process.env.JWT_SECRET;

// Handle POST request for creating or updating user
async function handleCreateOrUpdateUser(event: any) {
  const eventUser = JSON.parse(event.body);
  const user = await createOrUpdateUser(eventUser);
  return createResponse(200, user);
}

// Handle GET request to fetch documents by user email
async function handleGetDocumentsByUserEmail(event: any) {
  const userEmail = event.pathParameters.userEmail;
  const documents = await getDocumentsByUserEmail(userEmail);
  return createResponse(200, documents);
}

// Handle GET request to fetch document by user email and documen name
async function handleGetDocumentByUserEmailAndDocumentName(event: any) {
  const userEmail = event.pathParameters.userEmail;
  const documentName = event.pathParameters.documentName;
  const document = await getDocumentByUserEmailAndDocumentName(
    userEmail,
    documentName
  );
  return createResponse(200, document);
}

// Handle DELETE request to delete document by user email and document name
async function handleDeleteDocumentByUserEmailAndDocumentName(event: any) {
  const userEmail = event.pathParameters.userEmail;
  const documentName = event.pathParameters.documentName;
  await deleteDocumentByUserEmailAndDocumentName(userEmail, documentName);
  await deletePoints(userEmail, documentName);
  return createResponse(200, { message: "Document deleted successfully" });
}

const mainHandler = async (event: any, context: any): Promise<any> => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await mongooseConnect();
    switch (event.routeKey) {
      // Handle user requests
      case "POST /users":
        return await handleCreateOrUpdateUser(event);

      // Handle document requests
      case "GET /users/{userEmail}/documents":
        return await handleGetDocumentsByUserEmail(event);
      case "GET /users/{userEmail}/documents/{documentName}":
        return await handleGetDocumentByUserEmailAndDocumentName(event);
      case "DELETE /users/{userEmail}/documents/{documentName}":
        return await handleDeleteDocumentByUserEmailAndDocumentName(event);
      // Default 404 route
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
