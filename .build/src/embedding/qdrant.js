"use strict";
exports.__esModule = true;
var js_client_rest_1 = require("@qdrant/js-client-rest");
var constants_1 = require("./constants");
var client = new js_client_rest_1.QdrantClient({
    url: constants_1.QDRANT_URL,
    apiKey: constants_1.QDRANT_API_KEY
});
