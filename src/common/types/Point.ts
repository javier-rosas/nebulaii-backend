export type Point = {
  id: string;
  vector: number[];
  payload: {
    userEmail: string;
    documentName: string;
    text: string;
    pageNumber: number;
    totalPageCount: number;
  };
};
