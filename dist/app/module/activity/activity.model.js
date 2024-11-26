"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const mongoose_1 = require("mongoose");
// Mongoose schema
const NotificationSchema = new mongoose_1.Schema({
    user: { type: String, required: true }, // Reference to the user, e.g., user ID or username
    message: { type: String, required: true }, // Notification message
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});
// Mongoose model
exports.Notification = (0, mongoose_1.model)('Notification', NotificationSchema);
