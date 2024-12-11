"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plan = void 0;
const mongoose = require('mongoose');
const PlanSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    priceId: {
        type: String,
        required: true, // Ensure this matches the Stripe Price ID
    },
    list: {
        type: Array,
        default: [],
    },
    amount: {
        type: Number,
        required: true, // Price in cents
    },
    currency: {
        type: String,
        required: true, // E.g., 'usd'
    },
    interval: {
        type: String,
        required: true, // E.g., 'month', 'year', etc.
    },
    interval_count: {
        type: Number,
        default: 1, // Default to 1 interval
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt timestamps
});
exports.Plan = mongoose.model('Plan', PlanSchema);
