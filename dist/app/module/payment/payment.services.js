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
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = require("../users/user.model");
const payment_constant_1 = require("./payment.constant");
const stripe = require('stripe')(config_1.default.stripe_secret_key);
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
    var _a, _b, _c, _d, _e, _f, _g;
    const { paymentMethodId, planType, email, couponId } = payload;
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
    //
    const subscriptionParams = {
        customer: customerId,
        items: [{ price: priceId }],
        expand: ["latest_invoice.payment_intent"],
    };
    // Check if a coupon exists
    if (couponId) {
        const coupon = yield stripe.coupons.retrieve(couponId);
        if (!coupon) {
            throw new AppError_1.default(404, "Coupon not found");
        }
        if (!coupon.valid) {
            throw new AppError_1.default(400, "Coupon is not valid");
        }
        if (coupon.redeem_by && Date.now() / 1000 > coupon.redeem_by) {
            throw new AppError_1.default(400, "Coupon is expired");
        }
        if (coupon.max_redemptions && coupon.times_redeemed >= coupon.max_redemptions) {
            throw new AppError_1.default(400, "Coupon has reached its maximum redemptions");
        }
        subscriptionParams.discounts = [
            {
                coupon: couponId, // Replace couponId with the actual coupon value
            },
        ];
    }
    // Create the subscription
    const subscription = yield stripe.subscriptions.create(subscriptionParams);
    const updateData = {
        isPayment: true,
        subscriptionId: subscription.id,
        subscriptionPlane: planType,
        priceId: priceId,
    };
    yield user_model_1.User.findByIdAndUpdate(userInfo._id, updateData);
    const returnData = {
        subscriptionPlane: planType,
        subtotal: ((_a = subscription === null || subscription === void 0 ? void 0 : subscription.latest_invoice) === null || _a === void 0 ? void 0 : _a.subtotal) || null,
        total: ((_b = subscription === null || subscription === void 0 ? void 0 : subscription.latest_invoice) === null || _b === void 0 ? void 0 : _b.total) || null,
        discount: ((_d = (_c = subscription === null || subscription === void 0 ? void 0 : subscription.latest_invoice) === null || _c === void 0 ? void 0 : _c.total_discount_amounts[0]) === null || _d === void 0 ? void 0 : _d.amount) || null,
        discountPercent: ((_g = (_f = (_e = subscription === null || subscription === void 0 ? void 0 : subscription.latest_invoice) === null || _e === void 0 ? void 0 : _e.discount) === null || _f === void 0 ? void 0 : _f.coupon) === null || _g === void 0 ? void 0 : _g.percent_off) || null
    };
    return returnData;
});
// const createSubscriptionInStripe=async(payload:any)=>{
// }
const cancelSubscriptionInStripe = (subscriptionId, user) => __awaiter(void 0, void 0, void 0, function* () {
    const cancelSubcription = yield stripe.subscriptions.cancel(subscriptionId);
    const updateData = {
        isPayment: false,
        subscriptionId: "",
        subscriptionPlane: "",
        priceId: "",
    };
    yield user_model_1.User.findByIdAndUpdate(user.userId, updateData);
    return cancelSubcription;
});
const updateSubscriptionInStripe = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { paymentMethodId, planType } = payload;
    const userInfo = yield user_model_1.User.findById(userId);
    if (!userInfo) {
        throw new AppError_1.default(404, "User not found");
    }
    const customerId = userInfo === null || userInfo === void 0 ? void 0 : userInfo.customerId;
    const selectedPlan = payment_constant_1.plans[planType];
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
const createCoupon = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("createCoupon");
});
exports.paymentServices = {
    createSubscriptionInStripe,
    cancelSubscriptionInStripe,
    updateSubscriptionInStripe,
    createCoupon
};
