export const createResponse = (statusCode: number, body: any) => {
  console.log("create response detected!!!");
  return {
    statusCode,
    body: JSON.stringify(body),
  };
};
