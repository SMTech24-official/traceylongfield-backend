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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const payment_services_1 = require("./payment.services");
// Create a subscription
const createSubscription = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { plan } = req.query;
    const data = req.body;
    const result = yield payment_services_1.paymentService.createSubscription(data);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Subscription created successfully",
        data: result,
    });
}));
// Create a subscription
const updateSubscriptionPlan = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { plan } = req.query;
    const data = req.body;
    const result = yield payment_services_1.paymentService.updateSubscriptionPlan(data);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Subscription created successfully",
        data: result,
    });
}));
// Cancel a subscription
const cancelSubscription = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { subscriptionId } = req.body;
    const { plan } = req.query;
    const result = yield payment_services_1.paymentService.cancelSubscription(subscriptionId);
    if (!result) {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.NOT_FOUND,
            success: false,
            message: "Subscription not found or already canceled",
            data: null,
        });
        return;
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Subscription canceled successfully",
        data: result,
    });
}));
// Get all payments (subscriptions) from the database
const getAllPayments = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_services_1.paymentService.getAllPaymentDataIntoDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "All payments retrieved successfully",
        data: result,
    });
}));
// Hard delete payment by ID
const deletePayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield payment_services_1.paymentService.deletePaymentDataFromDB(id);
    if (!result) {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.NOT_FOUND,
            success: false,
            message: "Payment record not found",
            data: null,
        });
        return;
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Payment record deleted successfully",
        data: result,
    });
}));
exports.paymentController = {
    createSubscription,
    cancelSubscription,
    deletePayment,
    getAllPayments,
    updateSubscriptionPlan
};
