"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentInformation = exports.Payment = void 0;
const mongoose_1 = require("mongoose");
const payment_constant_1 = require("./payment.constant");
// Define the Payment Schema
const PaymentSchema = new mongoose_1.Schema({
    userEmail: { type: String, required: true },
    paymentMethodId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    paymentStatus: {
        type: String,
        enum: Object.values(payment_constant_1.PaymentStatus),
        default: payment_constant_1.PaymentStatus.PENDING
    },
    paymentIntentId: { type: String, required: false },
    subscriptionId: { type: String, required: false },
    planType: { type: String, required: true },
    planDuration: { type: Number, required: true }, // duration in days
    currentPeriodEnd: { type: Date, required: true },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});
// Create and export the Payment model
exports.Payment = (0, mongoose_1.model)('Payment', PaymentSchema);
// Define the PaymentInformation Schema
const PaymentInformationSchema = new mongoose_1.Schema({
    buyerEmail: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    transactionId: { type: String, required: false },
    customerId: { type: String, required: true },
    planType: { type: String, required: true },
    planDuration: { type: Number, required: true }, // duration in days
    currentPeriodEnd: { type: Date, required: true },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});
// Create and export the PaymentInformation model
exports.PaymentInformation = (0, mongoose_1.model)('PaymentInformation', PaymentInformationSchema);
