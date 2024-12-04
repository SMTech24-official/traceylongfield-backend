
import AppError from "../../errors/AppError";
import { User } from "../users/user.model";
import { plans } from "./payment.constant";

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

const createSubscriptionInStripe = async ( payload: any) => {
  const { paymentMethodId, planType,email } = payload;

  const userInfo = await User.findOne({email:email});

  const selectedPlan = plans[planType as keyof typeof plans];
  if (!selectedPlan) {
    throw new AppError(400, "Invalid plan type");
  }
  const priceId = selectedPlan.priceId;
  if (!userInfo) {
    throw new AppError(404, "User not found");
  }

  let customerId = userInfo.customerId;
  if (!customerId) {
    const customer = await stripe.customers.create({ email: userInfo.email });
   
    customerId = customer.id;
    await User.findByIdAndUpdate(userInfo._id, { customerId: customer.id });
  }

  await stripe.paymentMethods.attach(paymentMethodId, {
    customer: customerId,
  });

  await stripe.customers.update(customerId, {
    invoice_settings: { default_payment_method: paymentMethodId },
  });

  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    expand: ["latest_invoice.payment_intent"],
  });

  const updateData = {
    isPayment: true,
    subscriptionId: subscription.id,
    subscriptionPlane:planType,
    priceId: priceId,
    
  };
  await User.findByIdAndUpdate(userInfo._id, updateData);
  return subscription;
};

const cancelSubscriptionInStripe = async (subscriptionId: string) => {
  const cancelSubcription = await stripe.subscriptions.cancel(subscriptionId);

  return cancelSubcription;
};

const updateSubscriptionInStripe = async (payload: any, userId: string) => {
  const { paymentMethodId,planType } = payload;
  const userInfo = await User.findById(userId);
  const customerId = userInfo?.customerId as string;

  if (!userInfo) {
    throw new AppError(404, "User not found");
  }

  const selectedPlan = plans[planType as keyof typeof plans];
  console.log(planType,selectedPlan)
  if (!selectedPlan) {
    throw new AppError(400, "Invalid plan type");
  }
  const priceId = selectedPlan.priceId;
  await stripe.paymentMethods.attach(paymentMethodId, {
    customer: customerId,
  });

  await stripe.customers.update(customerId, {
    invoice_settings: { default_payment_method: paymentMethodId },
  });

  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    expand: ["latest_invoice.payment_intent"],
  });

  const updateData = {
    isPayment: true,
    subscriptionId: subscription.id,
    subscriptionPlane:planType,
    priceId: priceId,
  };
  await User.findByIdAndUpdate(userId, updateData);
  await stripe.subscriptions.cancel(userInfo.subscriptionId);
  return subscription;
};


export const paymentServices = {

  createSubscriptionInStripe,
  cancelSubscriptionInStripe,
  updateSubscriptionInStripe,
};
