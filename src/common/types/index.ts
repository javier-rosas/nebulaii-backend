export type Point = {
  id: string;
  vector: number[];
  payload: {
    userEmail: string;
    documentName: string;
    text: string;
    parentId: string;
  };
};

export type Chunk = {
  content: string;
  parentId?: string; // only for small chunks
};