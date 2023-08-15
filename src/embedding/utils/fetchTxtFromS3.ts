import { S3 } from "aws-sdk";
import { AWS_BUCKET } from "../../common/constants";
import { promises as fs } from "fs";

export const fetchTxtFromS3 = async (key: string): Promise<string> => {
  const s3 = new S3();
  const params: S3.GetObjectRequest = {
    Bucket: AWS_BUCKET,
    Key: key,
  };
  try {
    const response = await s3.getObject(params).promise();
    const body = response.Body;
    if (!body) throw new Error("No body found in S3 response");
    const content = body.toString("utf-8");
    return content;
  } catch (error) {
    console.error("Error while reading the object:", error);
    throw error;
  }
};

export const fetchTxtFromLocal = async (path: string): Promise<string> => {
  try {
    return await fs.readFile(
      "/Users/javierrosas/Documents/nebulaii-project/nebulaii-backend/src/common/local/meditations.txt",
      "utf-8"
    );
  } catch (err) {
    console.error("Error reading the file", err);
    return "";
  }
};
