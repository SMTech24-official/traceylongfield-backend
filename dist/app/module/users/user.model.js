"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
// Define the schema for the User model
const userSchema = new mongoose_1.Schema({
    fullName: { type: String, required: true },
    reviewerName: { type: String, required: true },
    amazonCountry: { type: String, required: true },
    amazonAuthorPageLink: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["admin", "author", "superAdmin"],
        required: true,
    },
    points: { type: Number, default: 0 },
    profileImage: { type: String, default: '' },
    otp: { type: Number, default: 0 },
    stripeCustomerId: { type: String },
    otpExpires: { type: Date },
    isVerified: { type: Boolean, default: false },
    isPayment: { type: Boolean, default: false },
    customerId: { type: String },
    subscriptionId: { type: String },
    priceId: { type: String },
    subscriptionPlane: { type: String, default: "" },
    invitedFriends: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    termsAccepted: { type: Boolean, default: false },
});
// Create the User model using the schema
exports.User = (0, mongoose_1.model)("User", userSchema);
// Adjust the path if needed
exports.User.watch([{ $match: { 'operationType': 'update' } }]) // Watch for update operations
    .on("change", (change) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if the change includes the 'invitedFriends' field update
        if (change.updateDescription.updatedFields.invitedFriends) {
            const userId = change.documentKey._id;
            const user = yield exports.User.findById(userId);
            if (user) {
                let point = 0;
                if (user.invitedFriends === 10) {
                    point = 100;
                }
                else if (user.invitedFriends === 20) {
                    point = 200;
                }
                // If points are assigned, update and save the user document
                if (point > 0) {
                    user.points = (user.points || 0) + point;
                    yield user.save();
                }
            }
        }
    }
    catch (error) {
        console.error("Error processing change:", error);
    }
}));
