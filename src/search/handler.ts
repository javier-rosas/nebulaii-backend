import { APIGatewayProxyHandler } from "aws-lambda";

export const handler: APIGatewayProxyHandler = async (event, context) => {
  // Your function logic here...
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Function executed successfully!",
    }),
  };
};
