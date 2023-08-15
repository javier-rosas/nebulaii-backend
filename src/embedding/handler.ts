import { APIGatewayProxyHandler } from "aws-lambda";
import { main } from "./main";

export const handler: APIGatewayProxyHandler = async (event: any, context) => {
  // Your function logic here...
  const userEmail = event.user.email;
  console.log(
    "🚀 ~ file: handler.ts:7 ~ consthandler:APIGatewayProxyHandler= ~ userEmail:",
    userEmail
  );
  const documentName = event.document.name;
  console.log(
    "🚀 ~ file: handler.ts:9 ~ consthandler:APIGatewayProxyHandler= ~ documentName:",
    documentName
  );
  await main(userEmail, documentName);
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Function executed successfully!",
    }),
  };
};
