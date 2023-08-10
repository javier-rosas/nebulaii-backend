"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var mongoose_1 = __importDefault(require("mongoose"));
var notesSchema = new mongoose_1["default"].Schema({
    userEmail: { type: String, required: true },
    filename: { type: String, required: true },
    notes: { type: String, required: true }
}, { collection: "notes" });
var NotesModel = mongoose_1["default"].model("NotesModel", notesSchema);
exports["default"] = NotesModel;
