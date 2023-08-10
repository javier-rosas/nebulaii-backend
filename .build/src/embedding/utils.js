"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.splitContentAndProcessChunks = exports.isExcedesMaxTokens = exports.fetchContentFromS3 = void 0;
var tiktoken_1 = require("@dqbd/tiktoken");
var constants_1 = require("./constants");
var text_splitter_1 = require("langchain/text_splitter");
var getEmbedding_1 = require("./getEmbedding");
var aws_sdk_1 = require("aws-sdk");
var fetchContentFromS3 = function (key) { return __awaiter(void 0, void 0, void 0, function () {
    var s3, params, response, body, content, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                s3 = new aws_sdk_1.S3();
                params = {
                    Bucket: constants_1.AWS_BUCKET,
                    Key: key
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, s3.getObject(params).promise()];
            case 2:
                response = _a.sent();
                body = response.Body;
                if (!body)
                    throw new Error("No body found in S3 response");
                content = body.toString("utf-8");
                return [2 /*return*/, content];
            case 3:
                error_1 = _a.sent();
                console.error("Error while reading the object:", error_1);
                throw error_1;
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.fetchContentFromS3 = fetchContentFromS3;
var countTokens = function (content) {
    var encoding = (0, tiktoken_1.get_encoding)("cl100k_base");
    var numTokens = encoding.encode(content).length;
    encoding.free();
    return numTokens;
};
var isExcedesMaxTokens = function (content) {
    var numTokens = countTokens(content);
    return numTokens > constants_1.MAX_TOKENS;
};
exports.isExcedesMaxTokens = isExcedesMaxTokens;
var splitContentAndProcessChunks = function (content) { return __awaiter(void 0, void 0, void 0, function () {
    var splitter, points, chunks, _i, chunks_1, chunk, res, embedding, point, error_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                splitter = new text_splitter_1.TokenTextSplitter({
                    chunkSize: constants_1.MAX_TOKENS,
                    chunkOverlap: 0
                });
                _b.label = 1;
            case 1:
                _b.trys.push([1, 7, , 8]);
                points = [];
                return [4 /*yield*/, splitter.splitText(content)];
            case 2:
                chunks = _b.sent();
                _i = 0, chunks_1 = chunks;
                _b.label = 3;
            case 3:
                if (!(_i < chunks_1.length)) return [3 /*break*/, 6];
                chunk = chunks_1[_i];
                return [4 /*yield*/, (0, getEmbedding_1.getEmbedding)(chunk, constants_1.OPEN_AI_API_KEY)];
            case 4:
                res = _b.sent();
                embedding = (_a = res === null || res === void 0 ? void 0 : res.data[0]) === null || _a === void 0 ? void 0 : _a.embedding;
                point = {
                    id: "1",
                    vector: embedding,
                    payload: {
                        userEmail: "javix98@gmail.com",
                        textChunk: chunk,
                        pageNumber: 1,
                        totalPageCount: 1
                    }
                };
                points.push(point);
                _b.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6: return [2 /*return*/, points];
            case 7:
                error_2 = _b.sent();
                console.error("Error while splitting content and processing chunks:", error_2);
                throw error_2;
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.splitContentAndProcessChunks = splitContentAndProcessChunks;
