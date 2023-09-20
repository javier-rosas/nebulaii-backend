import { createResponse } from "../common/utils/createResponse";
import { main } from "./main";
import { mongooseConnect } from "../common/mongoose/mongooseConnect";
import { updateJobStatus } from "../common/mongoose/queries/job";

// Lambda function handler
export const handler = async (event: any, context: any) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const userEmail = event.userEmail;
  const documentName = event.documentName;
  try {
    await mongooseConnect();
    await main(userEmail, documentName);
    await updateJobStatus(userEmail, documentName, "SUCCESS");
    return createResponse(200, { message: "Success" });
  } catch (error) {
    console.error("Error processing document:", error.message);
    await updateJobStatus(userEmail, documentName, "FAILED");
    return createResponse(500, { error: "Internal Server Error" });
  }
};
