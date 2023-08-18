import { APIGatewayProxyHandler } from "aws-lambda";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const handler: APIGatewayProxyHandler = async (event, context) => {
  const user = JSON.parse(event.body);
  try {
    const token = jwt.sign(user, JWT_SECRET, {
      expiresIn: "365d",
    });
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "User authenticated",
        token,
      }),
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Unable to authenticate user" }),
    };
  }
};
