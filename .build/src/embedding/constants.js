"use strict";
exports.__esModule = true;
exports.AWS_BUCKET = exports.EMBEDDING_MODEL = exports.OPEN_AI_EMBEDDINGS_ENDPOINT = exports.OPEN_AI_API_KEY = exports.QDRANT_API_KEY = exports.QDRANT_URL = exports.MAX_TOKENS = void 0;
// max tokens
exports.MAX_TOKENS = 8000;
// qdrant
exports.QDRANT_URL = process.env.QDRANT_URL;
exports.QDRANT_API_KEY = process.env.QDRANT_API_KEY;
// open ai
exports.OPEN_AI_API_KEY = process.env.OPEN_AI_API_KEY;
exports.OPEN_AI_EMBEDDINGS_ENDPOINT = "https://api.openai.com/v1/embeddings";
exports.EMBEDDING_MODEL = "text-embedding-ada-002";
// aws
exports.AWS_BUCKET = process.env.AWS_BUCKET;
