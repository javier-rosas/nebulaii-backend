"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var mongoose_1 = __importDefault(require("mongoose"));
var userSchema = new mongoose_1["default"].Schema({
    email: { type: String, required: true },
    email_verified: { type: Boolean, required: true },
    family_name: { type: String },
    given_name: { type: String },
    locale: { type: String },
    name: { type: String },
    nickname: { type: String },
    picture: { type: String },
    sid: { type: String },
    sub: { type: String },
    updated_at: { type: String },
    accountType: { type: String, "default": "BASIC", required: true }
}, { collection: 'users' });
var UserModel = mongoose_1["default"].model("UserModel", userSchema);
exports["default"] = UserModel;
