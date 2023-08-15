import { QdrantClient } from "@qdrant/js-client-rest";
//import dotenv from "dotenv";
//dotenv.config();

// connect to Qdrant Cloud
const client = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

const deleteCollection = async () => {
  // collection name to delete
  const collectionName = "nebulaii_docs";
  // get all collections
  const response = await client.getCollections();
  const collectionNames = response.collections.map(
    (collection) => collection.name
  );

  // delete collection
  if (collectionNames.includes(collectionName)) {
    await client.deleteCollection(collectionName);
  }
};

const createCollection = async () => {
  // collection name to delete
  const collectionName = "nebulaii_docs";

  // create collection
  await client.createCollection(collectionName, {
    hnsw_config: {
      payload_m: 16,
      m: 0,
    },
    optimizers_config: {
      memmap_threshold: 10000,
    },
    vectors: {
      size: 1536,
      distance: "Cosine",
    },
    on_disk_payload: true,
  });

  await client.createPayloadIndex(collectionName, {
    field_name: "userEmail",
    field_schema: "keyword",
    wait: true,
  });

  await client.createPayloadIndex(collectionName, {
    field_name: "documentName",
    field_schema: "keyword",
    wait: true,
  });

  return 0;
};

createCollection()
  .then((code) => {
    process.exit(code);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
