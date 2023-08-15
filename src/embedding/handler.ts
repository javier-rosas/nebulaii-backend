import { APIGatewayProxyHandler } from "aws-lambda";
import { main } from "./main";

export const handler: APIGatewayProxyHandler = async (event: any, context) => {
  // Your function logic here...
  const userEmail = event.user.email;
  const documentName = event.document.name;
  await main(userEmail, documentName);
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Function executed successfully!",
    }),
  };
};
