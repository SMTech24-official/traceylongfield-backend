"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Point = void 0;
const mongoose_1 = require("mongoose");
const pointsSchema = new mongoose_1.Schema({
    type: { type: String, required: true, unique: true },
    points: { type: Number, required: true }
}, { timestamps: true });
exports.Point = (0, mongoose_1.model)("Point", pointsSchema);
