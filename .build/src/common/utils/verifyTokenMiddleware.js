"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.verifyTokenMiddleware = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function verifyTokenMiddleware(options) {
    return {
        before: function (handler, next) {
            var token = handler.event.headers.authorization;
            if (!token) {
                return next(new Error("Authorization token missing."));
            }
            try {
                var decoded = jsonwebtoken_1["default"].verify(token, options.secret);
                handler.event.user = decoded;
                next();
            }
            catch (err) {
                next(new Error("Invalid token."));
            }
        }
    };
}
exports.verifyTokenMiddleware = verifyTokenMiddleware;
