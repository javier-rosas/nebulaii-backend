"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var mongoose_1 = __importDefault(require("mongoose"));
var fileSchema = new mongoose_1["default"].Schema({
    userEmail: { type: String, required: true },
    filename: { type: String, required: true },
    description: { type: String, required: true },
    dateAdded: { type: Date, "default": Date.now, required: true }
}, { collection: "files" });
var FileModel = mongoose_1["default"].model("FileModel", fileSchema);
exports["default"] = FileModel;
