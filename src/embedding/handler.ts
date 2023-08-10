import { APIGatewayProxyHandler } from "aws-lambda";
import { main } from "./getDocFromS3";

export const handler: APIGatewayProxyHandler = async (event, context) => {
  // Your function logic here...
  await main();
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Function executed successfully!",
    }),
  };
};
