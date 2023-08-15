export type Point = {
  id: string;
  vector: number[];
  payload: {
    userEmail: string;
    text: string;
    pageNumber: number;
    totalPageCount: number;
  };
};
