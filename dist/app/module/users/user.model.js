"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// Mongoose Schema
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    username: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'user', "superAdmin"],
        default: 'user',
        required: true,
    },
    level: {
        type: Number,
        default: 1,
        min: 1,
    },
    points: {
        type: Number,
        default: 0,
    },
    streak: {
        type: Number,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: false
    },
    avatar: {
        type: String,
        default: 'default_avatar_url',
    },
    invitedFriends: {
        type: Number,
        default: 0,
    },
    termsAccepted: {
        type: Boolean,
        default: false,
        required: false, // Optional field
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt
});
// Export the model
exports.User = mongoose_1.default.model('User', userSchema);
