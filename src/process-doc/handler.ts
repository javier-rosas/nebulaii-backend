import { APIGatewayProxyHandler } from "aws-lambda";
import { createJob } from "../common/mongoose/queries/job";
import { createResponse } from "../common/utils/createResponse";
import { main } from "./main";
import middy from "middy";
import { mongooseConnect } from "../common/mongoose/mongooseConnect";
import { verifyTokenMiddleware } from "../common/utils/verifyTokenMiddleware";

const JWT_SECRET = process.env.JWT_SECRET;

// Handler for the Lambda function.
// async function handleMainEvent(event: any) {
//   const userEmail = event.pathParameters.userEmail;
//   const documentName = event.pathParameters.documentName;
//   const job = await createJob(userEmail, documentName);
//   await main(userEmail, documentName);
//   return createResponse(202, job);
// }

// Lambda function handler
// export const handler: APIGatewayProxyHandler = async (event: any) => {
//   try {
//     await mongooseConnect();
//     const userEmail = event.pathParameters.userEmail;
//     const documentName = event.pathParameters.documentName;
//     await main(userEmail, documentName);
//   } catch (error) {
//     return createResponse(500, { error: "Internal Server Error" });
//   }
// };

// Lambda function handler with middleware
// export const handler = middy(mainHandler).use(
//   verifyTokenMiddleware({ secret: JWT_SECRET })
// );

// Lambda function handler
export const handler = async (event: any) => {
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
