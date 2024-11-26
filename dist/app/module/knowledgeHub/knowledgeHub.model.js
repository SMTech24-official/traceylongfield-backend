"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Video = void 0;
const mongoose_1 = require("mongoose");
const VideoSchema = new mongoose_1.Schema({
    videoUrl: { type: String, required: true },
}, { timestamps: true });
exports.Video = (0, mongoose_1.model)("Video", VideoSchema);
