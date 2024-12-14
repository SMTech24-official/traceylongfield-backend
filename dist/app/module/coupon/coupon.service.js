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
exports.couponService = void 0;
const config_1 = __importDefault(require("../../config"));
const stripe = require('stripe')(config_1.default.stripe_secret_key);
const couponInsertIntoDB = () => __awaiter(void 0, void 0, void 0, function* () {
    // Step 1: Create a Product
    const product = yield stripe.products.create({
        name: 'Pro Subscription',
        description: 'Access to premium features',
    });
    // Step 2: Create a Price for the Product
    const price = yield stripe.prices.create({
        unit_amount: 2000, // Price in cents ($20.00)
        currency: 'usd',
        recurring: { interval: 'month' }, // Monthly subscription
        product: product.id,
    });
    // Step 3: Create a Coupon
    const coupon = yield stripe.coupons.create({
        name: 'New Year Sale - 25% Off',
        percent_off: 25,
        duration: 'repeating',
        duration_in_months: 3, // Apply coupon for 3 months
    });
    // Step 4: Apply Coupon and Create Subscription
    const customer = yield stripe.customers.create({
        email: 'customer@example.com', // Replace with the customer's email
        name: 'John Doe',
    });
    // await stripe.paymentMethods.attach('pm_1QSBZrFGNtvHx4UtyI7lnedr', {
    //   customer: customer.id,
    // });
    const subscription = yield stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: price.id }],
        discounts: [{ coupon: coupon.id }], // Apply the coupon
    });
    return {
        product,
        price,
        coupon,
        subscription,
    };
});
exports.couponService = {
    couponInsertIntoDB,
};
