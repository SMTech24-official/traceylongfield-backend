"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoutes = void 0;
const express_1 = require("express");
const payment_controller_1 = require("./payment.controller");
const router = (0, express_1.Router)();
// Route to create a new subscription
router.post("/subscribe", payment_controller_1.paymentController.createSubscription);
// Route to cancel a subscription
router.post("/cancel", payment_controller_1.paymentController.cancelSubscription);
// Route to get all payments (subscriptions) from the database
router.get("/payments", payment_controller_1.paymentController.getAllPayments);
// Route to update a payment by its ID
router.put("/payments/update", payment_controller_1.paymentController.updateSubscriptionPlan);
// Route to delete a payment by its ID
router.delete("/payments/:id", payment_controller_1.paymentController.deletePayment);
router.post("/create-checkout-session", payment_controller_1.paymentController.buySubscription);
exports.PaymentRoutes = router;
