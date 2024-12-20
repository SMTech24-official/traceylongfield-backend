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
    bookFormate: { type: String, required: true },
    bookCover: { type: String, required: true },
    bookPdf: { type: String },
    reviewCount: { type: Number, default: 0 },
    status: { type: String, enum: ["pending", "live"] },
    genre: { type: String, required: true },
    isReadyForReview: { type: Boolean, default: false },
    bookType: { type: String, required: true },
    points: { type: Number, required: true }
    //wordCount: { type: Number, required: true },
}, { timestamps: true });
// Create the model
exports.Book = (0, mongoose_1.model)("Book", BookSchema);
