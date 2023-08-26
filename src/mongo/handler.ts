import middy from "middy";
import { mongooseConnect } from "../common/mongoose/mongooseConnect";
import { createOrUpdateUser } from "../common/mongoose/queries/user";
import {
  getDocumentsByUserEmail,
  getDocumentByUserEmailAndDocumentName,
  deleteDocumentByUserEmailAndDocumentName,
} from "../common/mongoose/queries/document";
import { createResponse } from "../common/utils/createResponse";
import { verifyTokenMiddleware } from "../common/utils/verifyTokenMiddleware";

const JWT_SECRET = process.env.JWT_SECRET;

// Handle POST request for creating or updating user
async function handleCreateOrUpdateUser(event: any) {
  const user = JSON.parse(event.body);
  return await createOrUpdateUser(user);
}

// Handle GET request to fetch documents by user email
async function handleGetDocumentsByUserEmail(event: any) {
  const userEmail = event.pathParameters.userEmail;
  return await getDocumentsByUserEmail(userEmail);
}

// Handle GET request to fetch document by user email and documen name
async function handleGetDocumentByUserEmailAndDocumentName(event: any) {
  const userEmail = event.pathParameters.userEmail;
  const documentName = event.pathParameters.documentName;
  return await getDocumentByUserEmailAndDocumentName(userEmail, documentName);
}

// Handle DELETE request to delete document by user email and document name
async function handleDeleteDocumentByUserEmailAndDocumentName(event: any) {
  const userEmail = event.pathParameters.userEmail;
  const documentName = event.pathParameters.documentName;
  return await deleteDocumentByUserEmailAndDocumentName(
    userEmail,
    documentName
  );
}

const mainHandler = async (event: any): Promise<any> => {
  try {
    await mongooseConnect();
    switch (event.routeKey) {
      case "POST /users":
        return await handleCreateOrUpdateUser(event);
      case "GET /users/{userEmail}/documents":
        return await handleGetDocumentsByUserEmail(event);
      case "GET /users/{userEmail}/documents/{documentName}":
        return await handleGetDocumentByUserEmailAndDocumentName(event);
      case "DELETE /users/{userEmail}/documents/{documentName}":
        return await handleDeleteDocumentByUserEmailAndDocumentName(event);
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
