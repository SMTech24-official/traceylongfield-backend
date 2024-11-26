"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorGuid = void 0;
const mongoose_1 = require("mongoose");
const AuthorGuidSchema = new mongoose_1.Schema({
    cover: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    addedBy: {
        type: String,
        required: true,
    },
    pdfFile: {
        type: String,
        required: true,
    },
}, { timestamps: true });
exports.AuthorGuid = (0, mongoose_1.model)('AuthorGuid', AuthorGuidSchema);
