"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
// Define the schema for the User model
const userSchema = new mongoose_1.Schema({
    fullName: { type: String, required: true },
    reviewerName: { type: String, required: true },
    amazonCountry: { type: String, required: true },
    amazonAuthorPageLink: { type: String, },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['admin', 'author', 'superAdmin'],
        required: true
    },
    points: { type: Number, default: 0 },
    profileImage: { type: String },
    otp: { type: Number },
    otpExpires: { type: Date },
    isVerified: { type: Boolean, default: false },
    isSubscribed: { type: Boolean, default: false },
    subscriptionPlane: { type: String, default: '' },
    invitedFriends: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    termsAccepted: { type: Boolean, default: false }
});
// Create the User model using the schema
exports.User = (0, mongoose_1.model)('User', userSchema);
