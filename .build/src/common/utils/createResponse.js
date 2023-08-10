"use strict";
exports.__esModule = true;
exports.createResponse = void 0;
var createResponse = function (statusCode, body) {
    console.log("create response detected!!!");
    return {
        statusCode: statusCode,
        body: JSON.stringify(body)
    };
};
exports.createResponse = createResponse;
