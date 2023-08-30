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

export type LargeChunk = {
  _id: string;
  userEmail: string;
  documentName: string;
  text: string;
};

export type QdrantPutResponse = {
  operation_id: number;
  status: "acknowledged" | "completed";
};

export type QdrantSearchResponse = {
  id: string | number;
  version: number;
  score: number;
  payload?: Record<string, unknown> | { [key: string]: unknown };
  vector?: number[] | Record<string, unknown> | { [key: string]: number[] };
}[];

export type QdrantDeleteResponse = {
  operation_id: number;
  status: "acknowledged" | "completed";
};
