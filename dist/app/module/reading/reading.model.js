"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadingBook = void 0;
const mongoose_1 = require("mongoose");
// Define the schema
const ReadingBookSchema = new mongoose_1.Schema({
    bookId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "Book" },
    userId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "User" },
    readingStatus: {
        type: String,
        enum: ["reading", "finished", "paused"],
        required: true,
    },
    isApproved: { type: Boolean, default: false }
}, { timestamps: true } // Automatically add createdAt and updatedAt fields
);
// Create and export the model
exports.ReadingBook = (0, mongoose_1.model)("ReadingBook", ReadingBookSchema);
