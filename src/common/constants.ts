// max tokens
export const MAX_TOKENS = 8000;

// qdrant
export const QDRANT_URL = process.env.QDRANT_URL;
export const QDRANT_API_KEY = process.env.QDRANT_API_KEY;
export const QDRANT_COLLECTION_NAME = process.env.QDRANT_COLLECTION_NAME;

// open ai
export const OPEN_AI_API_KEY = process.env.OPEN_AI_API_KEY;
export const OPEN_AI_EMBEDDINGS_ENDPOINT =
  "https://api.openai.com/v1/embeddings";
export const EMBEDDING_MODEL = "text-embedding-ada-002";

// aws
export const AWS_BUCKET = process.env.AWS_BUCKET;
