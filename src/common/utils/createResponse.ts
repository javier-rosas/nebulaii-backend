export const createResponse = (statusCode: number, body: any) => {
  return {
    statusCode,
    body: JSON.stringify(body),
  };
};
