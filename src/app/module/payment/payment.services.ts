import config from "../../config";
import Stripe from "stripe";
import { User } from "../users/user.model";
import { Payment, PaymentInformation } from "./payment.model";
import { plans } from "./payment.constant";
import { CreatePaymentInput } from "./payment.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const stripe = new Stripe(config.stripe_secret_key as string);

export const createOrFetchStripeCustomer = async (
  userEmail: string
): Promise<string> => {
  try {
    // Fetch the user from the database
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      throw new Error("User not found.");
    }

    // If the user already has a Stripe customer ID, return it
    if (user.stripeCustomerId) {
      return user.stripeCustomerId;
    }

    // Create a new Stripe customer if none exists
    const customer = await stripe.customers.create({
      email: user.email, // Assuming the user has an email field
      metadata: { userEmail: user.email }, // Optionally, store more metadata
    });

    // Save the new Stripe customer ID in the MongoDB database
    user.stripeCustomerId = customer.id;
    await user.save();

    return customer.id; // Return the new Stripe customer ID (string)
  } catch (error) {
    console.error("Error creating or fetching Stripe customer:", error);
    throw new Error("Failed to create or fetch Stripe customer.");
  }
};

const createSubscription = async (paymentData: CreatePaymentInput) => {
  const { planType, userEmail, paymentMethodId } = paymentData;

  // Define the plans
  const selectedPlan = plans[planType as keyof typeof plans];

  if (!selectedPlan) {
    throw new Error("Invalid plan type");
  }

  // Fetch or create Stripe customer ID (customerId is a string)
  const customerId = await createOrFetchStripeCustomer(userEmail);

  // Attach payment method to the customer
  await stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });

  // Create a Stripe subscription for the customer with a 1 month trial
  const subscription = await stripe.subscriptions.create({
    customer: customerId, // This now expects a string, which is customerId
    items: [{ price: selectedPlan.priceId }],
    default_payment_method: paymentMethodId,
    trial_period_days: 30, // Set the trial period for 1 month (30 days)
    expand: ["latest_invoice.payment_intent"],
  });

  const currentPeriodEnd = subscription.current_period_end;

  // Check for the payment intent in the latest invoice
  const latestInvoice = subscription.latest_invoice;
  const invoiceId =
    latestInvoice && typeof latestInvoice !== "string"
      ? latestInvoice.id
      : latestInvoice;
  const paymentIntent =
    latestInvoice && typeof latestInvoice !== "string"
      ? latestInvoice.payment_intent
      : null;

  if (!paymentIntent || paymentIntent === null) {
    throw new Error("Payment intent not found in the latest invoice.");
  }

  // Store subscription and payment details in the MongoDB database
  const payment = await Payment.create({
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
  const paymentInformation = await PaymentInformation.create({
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
  await User.updateOne(
    { email: userEmail },
    { paymentStatus: true } // User is now subscribed
  );

  return paymentIntent;
};

const cancelSubscription = async (
  subscriptionId: string
): Promise<Stripe.Subscription | null> => {
  try {
    // Cancel the Stripe subscription
    const subscription = await stripe.subscriptions.cancel(subscriptionId);

    // If the subscription was successfully canceled, update the database
    if (subscription && subscription.status === "canceled") {
      // Update the payment status to "EXPIRED" for all payments with the matching subscription ID
      await Payment.updateMany(
        { paymentIntentId: subscription.id },
        { paymentStatus: "EXPIRED" }
      );

      // Update the user's payment status to false (no active subscription)
      await User.updateMany(
        { "subscriptions.subscriptionId": subscriptionId }, // assuming your User model has subscriptions array
        { paymentStatus: false }
      );
    }

    return subscription;
  } catch (error) {
    console.error("Error canceling subscription:", error);
    throw new Error(
      `Failed to cancel the subscription with ID: ${subscriptionId}`
    );
  }
};

export const checkExpiredSubscriptions = async () => {
  const currentTime = new Date();

  try {
    // Fetch all active subscriptions where currentPeriodEnd has passed
    const expiredSubscriptions = await Payment.find({
      paymentStatus: "ACTIVE",
      currentPeriodEnd: { $lte: currentTime }, // Check if currentPeriodEnd is less than or equal to now
    });

    for (const subscription of expiredSubscriptions) {
      // Update subscription status to EXPIRED
      await Payment.updateOne(
        { _id: subscription._id },
        { paymentStatus: "EXPIRED" }
      );

      // Update the user status to false for all affected users
      await User.updateMany(
        { "subscriptions.subscriptionId": subscription.subscriptionId }, // assuming subscriptions field exists in User model
        { paymentStatus: false }
      );
    }
  } catch (error) {
    console.error("Error checking for expired subscriptions:", error);
    throw new Error("Failed to check expired subscriptions.");
  }
};
// Fetch all payment data from the database
const getAllPaymentDataIntoDB = async () => {
  try {
    // Use Mongoose to fetch all payments from the Payment collection
    const result = await Payment.find();
  
    return result;
  } catch (error) {
    console.error("Error fetching all payment data:", error);
    throw new Error("Failed to fetch all payment data.");
  }
};
// Delete payment data from the database by ID
const deletePaymentDataFromDB = async (id: string) => {

    // Use Mongoose to delete a payment by ID from the Payment collection
    const result = await Payment.findByIdAndDelete(id);
    if (!result) {
      throw new AppError(httpStatus.NOT_FOUND,"Payment not found.");
    }
    return result;

  
  
};
export const paymentService = {
  createSubscription,
  cancelSubscription,
  getAllPaymentDataIntoDB,
  deletePaymentDataFromDB,
};