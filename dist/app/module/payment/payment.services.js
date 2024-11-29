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
exports.paymentService = exports.checkExpiredSubscriptions = exports.createOrFetchStripeCustomer = void 0;
const stripe_1 = __importDefault(require("stripe"));
const user_model_1 = require("../users/user.model");
const payment_model_1 = require("./payment.model");
const payment_constant_1 = require("./payment.constant");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const stripe = new stripe_1.default("sk_test_51QA6IkFGNtvHx4UtPq0S9a91GR9VUfXVIEptfIdma8LX8ITVSKu5ehK3MclRD9qDN5lYgJZCXp8RRWkKKWKEcP98004GHpKW2R");
const createOrFetchStripeCustomer = (userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch the user from the database
        const user = yield user_model_1.User.findOne({ email: userEmail });
        if (!user) {
            throw new Error("User not found.");
        }
        // If the user already has a Stripe customer ID, return it
        if (user.stripeCustomerId) {
            return user.stripeCustomerId;
        }
        // Create a new Stripe customer if none exists
        const customer = yield stripe.customers.create({
            email: user.email, // Assuming the user has an email field
            metadata: { userEmail: user.email }, // Optionally, store more metadata
        });
        // Save the new Stripe customer ID in the MongoDB database
        user.stripeCustomerId = customer.id;
        yield user.save();
        return customer.id; // Return the new Stripe customer ID (string)
    }
    catch (error) {
        console.error("Error creating or fetching Stripe customer:", error);
        throw new Error("Failed to create or fetch Stripe customer.");
    }
});
exports.createOrFetchStripeCustomer = createOrFetchStripeCustomer;
const createSubscription = (paymentData) => __awaiter(void 0, void 0, void 0, function* () {
    const { planType, userEmail, paymentMethodId } = paymentData;
    // Define the plans
    const selectedPlan = payment_constant_1.plans[planType];
    if (!selectedPlan) {
        throw new Error("Invalid plan type");
    }
    // Fetch or create Stripe customer ID (customerId is a string)
    const customerId = yield (0, exports.createOrFetchStripeCustomer)(userEmail);
    // Attach payment method to the customer
    yield stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });
    // Create a Stripe subscription for the customer with a 1 month trial
    const subscription = yield stripe.subscriptions.create({
        customer: customerId, // This now expects a string, which is customerId
        items: [{ price: selectedPlan.priceId }],
        default_payment_method: paymentMethodId,
        trial_period_days: 30, // Set the trial period for 1 month (30 days)
        expand: ["latest_invoice.payment_intent"],
    });
    const currentPeriodEnd = subscription.current_period_end;
    // Check for the payment intent in the latest invoice
    const latestInvoice = subscription.latest_invoice;
    const invoiceId = latestInvoice && typeof latestInvoice !== "string"
        ? latestInvoice.id
        : latestInvoice;
    const paymentIntent = latestInvoice && typeof latestInvoice !== "string"
        ? latestInvoice.payment_intent
        : null;
    if (!paymentIntent || paymentIntent === null) {
        throw new Error("Payment intent not found in the latest invoice.");
    }
    // Store subscription and payment details in the MongoDB database
    const payment = yield payment_model_1.Payment.create({
        userEmail,
        paymentMethodId,
        paymentStatus: "ACTIVE", // Active status, but the user is in trial
        amount: selectedPlan.price,
        paymentIntentId: subscription.id,
        planType,
        planDuration: selectedPlan.duration,
        currency: "usd",
        currentPeriodEnd: new Date(currentPeriodEnd * 1000), // Convert from Unix timestamp
    });
    // Store additional payment information
    const paymentInformation = yield payment_model_1.PaymentInformation.create({
        buyerEmail: userEmail,
        amount: selectedPlan.price,
        currency: "usd",
        transactionId: invoiceId,
        customerId,
        planType,
        planDuration: selectedPlan.duration,
        currentPeriodEnd: new Date(currentPeriodEnd * 1000), // Convert from Unix timestamp
    });
    // Update user's payment status to active
    yield user_model_1.User.updateOne({ email: userEmail }, { paymentStatus: true } // User is now subscribed
    );
    return paymentIntent;
});
const cancelSubscription = (subscriptionId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Cancel the Stripe subscription
        const subscription = yield stripe.subscriptions.cancel(subscriptionId);
        // If the subscription was successfully canceled, update the database
        if (subscription && subscription.status === "canceled") {
            // Update the payment status to "EXPIRED" for all payments with the matching subscription ID
            yield payment_model_1.Payment.updateMany({ paymentIntentId: subscription.id }, { paymentStatus: "EXPIRED" });
            // Update the user's payment status to false (no active subscription)
            yield user_model_1.User.updateMany({ "subscriptions.subscriptionId": subscriptionId }, // assuming your User model has subscriptions array
            { paymentStatus: false });
        }
        return subscription;
    }
    catch (error) {
        console.error("Error canceling subscription:", error);
        throw new Error(`Failed to cancel the subscription with ID: ${subscriptionId}`);
    }
});
const updateSubscriptionPlan = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userEmail, newPlanType } = data;
        // Define the plans
        const newPlan = payment_constant_1.plans[newPlanType];
        if (!newPlan) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid plan type.");
        }
        // Fetch the user from the database
        const user = yield user_model_1.User.findOne({ email: userEmail });
        if (!user) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found.");
        }
        // Check if the user has an active subscription
        const existingPayment = yield payment_model_1.Payment.findOne({
            userEmail,
            paymentStatus: "ACTIVE",
        });
        if (!existingPayment) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "No active subscription found for the user.");
        }
        // Update the subscription in Stripe
        const updatedSubscription = yield stripe.subscriptions.update(existingPayment.paymentIntentId, // Stripe subscription ID
        {
            items: [
                {
                    id: existingPayment.paymentIntentId, // The subscription item ID
                    price: newPlan.priceId, // The new plan's price ID
                },
            ],
            proration_behavior: "create_prorations", // Adjusts billing for the change
        });
        // Update the database with the new plan details
        yield payment_model_1.Payment.updateOne({ userEmail, paymentIntentId: existingPayment.paymentIntentId }, {
            planType: newPlanType,
            planDuration: newPlan.duration,
            amount: newPlan.price,
            currentPeriodEnd: new Date(updatedSubscription.current_period_end * 1000),
        });
        return updatedSubscription;
    }
    catch (error) {
        console.error("Error updating subscription plan:", error);
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, error.message);
    }
});
const checkExpiredSubscriptions = () => __awaiter(void 0, void 0, void 0, function* () {
    const currentTime = new Date();
    try {
        // Fetch all active subscriptions where currentPeriodEnd has passed
        const expiredSubscriptions = yield payment_model_1.Payment.find({
            paymentStatus: "ACTIVE",
            currentPeriodEnd: { $lte: currentTime }, // Check if currentPeriodEnd is less than or equal to now
        });
        for (const subscription of expiredSubscriptions) {
            // Update subscription status to EXPIRED
            yield payment_model_1.Payment.updateOne({ _id: subscription._id }, { paymentStatus: "EXPIRED" });
            // Update the user status to false for all affected users
            yield user_model_1.User.updateMany({ "subscriptions.subscriptionId": subscription.subscriptionId }, // assuming subscriptions field exists in User model
            { paymentStatus: false });
        }
    }
    catch (error) {
        console.error("Error checking for expired subscriptions:", error);
        throw new Error("Failed to check expired subscriptions.");
    }
});
exports.checkExpiredSubscriptions = checkExpiredSubscriptions;
// Fetch all payment data from the database
const getAllPaymentDataIntoDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Use Mongoose to fetch all payments from the Payment collection
        const result = yield payment_model_1.Payment.find();
        return result;
    }
    catch (error) {
        console.error("Error fetching all payment data:", error);
        throw new Error("Failed to fetch all payment data.");
    }
});
// Delete payment data from the database by ID
const deletePaymentDataFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // Use Mongoose to delete a payment by ID from the Payment collection
    const result = yield payment_model_1.Payment.findByIdAndDelete(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Payment not found.");
    }
    return result;
});
const buySubscription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const YOUR_DOMAIN = "http://localhost:3000";
    console.log("Your domain");
    const session = yield stripe.checkout.sessions.create({
        line_items: [
            {
                // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                price: 'price_1QQNW1FGNtvHx4UtxklB261z',
                quantity: 1,
            },
        ],
        mode: 'subscription',
        success_url: `${YOUR_DOMAIN}/dashboard`,
        cancel_url: `${YOUR_DOMAIN}/plans`,
    });
    //res.redirect(session.url)
    console.log(session);
    res.redirect(session.url);
});
exports.paymentService = {
    createSubscription,
    cancelSubscription,
    getAllPaymentDataIntoDB,
    deletePaymentDataFromDB,
    updateSubscriptionPlan,
    buySubscription
};
