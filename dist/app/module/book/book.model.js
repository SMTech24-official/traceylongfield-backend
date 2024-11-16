"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
const mongoose_1 = require("mongoose");
// Define the schema
const BookSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    authorName: { type: String, required: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    amazonBookUrl: { type: String, required: true }, // Optional field
    bookReader: { type: String, required: true },
    bookCover: { type: String, required: true },
    bookPdf: { type: String },
    status: { type: String, enum: ["pending", "live"] },
    genre: { type: String, required: true },
    bookType: { type: String, required: true },
    //wordCount: { type: Number, required: true },
}, { timestamps: true });
// Create the model
exports.Book = (0, mongoose_1.model)("Book", BookSchema);
