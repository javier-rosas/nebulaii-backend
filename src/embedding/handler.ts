import middy from "middy";
import { verifyTokenMiddleware } from "../common/utils/verifyTokenMiddleware";
import { APIGatewayProxyHandler } from "aws-lambda";
import { main } from "./main";

const JWT_SECRET = process.env.JWT_SECRET;

export const mainHandler: APIGatewayProxyHandler = async (
  event: any,
  context
) => {
  // Your function logic here...
  const userEmail = event.user;
  const documentName = event.body.name;

  await main(userEmail, documentName);
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Function executed successfully!",
    }),
  };
};

export const handler = middy(mainHandler).use(
  verifyTokenMiddleware({ secret: JWT_SECRET })
);
