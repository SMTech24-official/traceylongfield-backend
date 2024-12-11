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
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const payment_services_1 = require("./payment.services");
const createSubscription = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const subcription = yield payment_services_1.paymentServices.createSubscriptionInStripe(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Subcription created successfully",
        data: subcription,
    });
}));
const cancelSubscription = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { subscriptionId } = req.body;
    const result = yield payment_services_1.paymentServices.cancelSubscriptionInStripe(subscriptionId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: false,
        message: "Subscription cancelled successfully",
        data: result,
    });
}));
const updateSubscription = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    console.log(req.body);
    const result = yield payment_services_1.paymentServices.updateSubscriptionInStripe(req.body, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Subscription updated successfully",
        data: result,
    });
}));
const createCoupon = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    console.log(req.body);
    const result = yield payment_services_1.paymentServices.createCoupon();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Subscription updated successfully",
        data: result,
    });
}));
exports.paymentController = {
    createSubscription,
    cancelSubscription,
    updateSubscription,
    createCoupon
};
