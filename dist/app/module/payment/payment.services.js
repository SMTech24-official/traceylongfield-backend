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
exports.paymentServices = void 0;
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = require("../users/user.model");
const payment_constant_1 = require("./payment.constant");
const stripe = require('stripe')('sk_test_51QA6IkFGNtvHx4UtPq0S9a91GR9VUfXVIEptfIdma8LX8ITVSKu5ehK3MclRD9qDN5lYgJZCXp8RRWkKKWKEcP98004GHpKW2R');
// const createPlanInStripe = async (payload: any) => {
//   const {
//     name,
//     description,
//     amount,
//     currency,
//     interval,
//     interval_count,
//     list,
//   } = payload;
//   // Step 1: Create a product
//   const product = await stripe.products.create({
//     name,
//     description,
//   });
//   // Step 2: Create a price for the product
//   const price = await stripe.prices.create({
//     unit_amount: amount * 100,
//     currency,
//     product: product.id,
//     recurring: {
//       interval: interval,
//        interval_count: interval_count,
//     },
//   });
//   const planInfo = await Plan.create({
//     name,
//     description,
//     priceId: price.id,
//     list,
//     amount,
//     currency,
//     interval,
//     interval_count,
//   });
//   return planInfo;
// };
const createSubscriptionInStripe = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { paymentMethodId, planType, email } = payload;
    const userInfo = yield user_model_1.User.findOne({ email: email });
    const selectedPlan = payment_constant_1.plans[planType];
    if (!selectedPlan) {
        throw new AppError_1.default(400, "Invalid plan type");
    }
    const priceId = selectedPlan.priceId;
    if (!userInfo) {
        throw new AppError_1.default(404, "User not found");
    }
    let customerId = userInfo.customerId;
    if (!customerId) {
        const customer = yield stripe.customers.create({ email: userInfo.email });
        customerId = customer.id;
        yield user_model_1.User.findByIdAndUpdate(userInfo._id, { customerId: customer.id });
    }
    yield stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
    });
    yield stripe.customers.update(customerId, {
        invoice_settings: { default_payment_method: paymentMethodId },
    });
    const subscription = yield stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        expand: ["latest_invoice.payment_intent"],
    });
    const updateData = {
        isPayment: true,
        subscriptionId: subscription.id,
        subscriptionPlane: planType,
        priceId: priceId,
    };
    yield user_model_1.User.findByIdAndUpdate(userInfo._id, updateData);
    return subscription;
});
const cancelSubscriptionInStripe = (subscriptionId) => __awaiter(void 0, void 0, void 0, function* () {
    const cancelSubcription = yield stripe.subscriptions.cancel(subscriptionId);
    return cancelSubcription;
});
const updateSubscriptionInStripe = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { paymentMethodId, planType } = payload;
    const userInfo = yield user_model_1.User.findById(userId);
    const customerId = userInfo === null || userInfo === void 0 ? void 0 : userInfo.customerId;
    if (!userInfo) {
        throw new AppError_1.default(404, "User not found");
    }
    const selectedPlan = payment_constant_1.plans[planType];
    console.log(planType, selectedPlan);
    if (!selectedPlan) {
        throw new AppError_1.default(400, "Invalid plan type");
    }
    const priceId = selectedPlan.priceId;
    yield stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
    });
    yield stripe.customers.update(customerId, {
        invoice_settings: { default_payment_method: paymentMethodId },
    });
    const subscription = yield stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        expand: ["latest_invoice.payment_intent"],
    });
    const updateData = {
        isPayment: true,
        subscriptionId: subscription.id,
        subscriptionPlane: planType,
        priceId: priceId,
    };
    yield user_model_1.User.findByIdAndUpdate(userId, updateData);
    yield stripe.subscriptions.cancel(userInfo.subscriptionId);
    return subscription;
});
exports.paymentServices = {
    createSubscriptionInStripe,
    cancelSubscriptionInStripe,
    updateSubscriptionInStripe,
};
