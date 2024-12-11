"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoutes = void 0;
const express_1 = require("express");
const payment_controller_1 = require("./payment.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const constant_1 = require("../../utils/constant");
const router = (0, express_1.Router)();
router.post("/create-subscription", payment_controller_1.paymentController.createSubscription);
router.post("/cancel-subscription", (0, auth_1.default)(constant_1.USER_ROLE.author), payment_controller_1.paymentController.cancelSubscription);
router.put("/update-subscription", (0, auth_1.default)(constant_1.USER_ROLE.author), payment_controller_1.paymentController.updateSubscription);
router.post("/create-coupon", (0, auth_1.default)(constant_1.USER_ROLE.author), payment_controller_1.paymentController.createCoupon);
exports.PaymentRoutes = router;
