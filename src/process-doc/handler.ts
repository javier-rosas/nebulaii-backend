import { createResponse } from "../common/utils/createResponse";
import { main } from "./main";
import { mongooseConnect } from "../common/mongoose/mongooseConnect";

// Lambda function handler
export const handler = async (event: any, context: any) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await mongooseConnect();
    const userEmail = event.userEmail;
    const documentName = event.documentName;
    const res = await main(userEmail, documentName);
    return res;
  } catch (error) {
    console.error("Error processing document:", error);
    return createResponse(500, { error: "Internal Server Error" });
  }
};
