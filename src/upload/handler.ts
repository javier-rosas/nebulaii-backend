import { APIGatewayProxyHandler } from "aws-lambda";
import { createResponse } from "../common/utils/createResponse";

export const handler: APIGatewayProxyHandler = async (event, context) => {
  createResponse(200, { message: "Function executed successfully!" });
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Function executed successfully!",
    }),
  };
};
