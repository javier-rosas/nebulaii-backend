export type Point = {
  id: string;
  vector: number[];
  payload: {
    userEmail: string;
    textChunk: string;
    pageNumber: number;
    totalPageCount: number;
  };
};
