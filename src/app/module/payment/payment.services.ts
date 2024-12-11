
import { disconnect } from "process";
import config from "../../config";
import AppError from "../../errors/AppError";
import { Plan } from "../plan/plan.mode";
import { User } from "../users/user.model";
import { plans } from "./payment.constant";
import { JwtPayload } from "jsonwebtoken";

const stripe = require('stripe')(config.stripe_secret_key);
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
  const { paymentMethodId, planType, email,couponId } = payload;

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

  //


  
  const subscriptionParams:any = {
    customer: customerId,
    items: [{ price: priceId }],
    expand: ["latest_invoice.payment_intent"],
  };
  
  // Check if a coupon exists
  if (couponId) {
    const coupon = await stripe.coupons.retrieve(couponId);

    if(!coupon){
      throw new AppError(404, "Coupon not found");
    }
    if (!coupon.valid) {
      throw new AppError(400, "Coupon is not valid");
    }
    if (coupon.redeem_by && Date.now() / 1000 > coupon.redeem_by) {
     throw new AppError(400, "Coupon is expired");
    }
    if (coupon.max_redemptions && coupon.times_redeemed >= coupon.max_redemptions) {
     throw new AppError(400, "Coupon has reached its maximum redemptions");
    }
    subscriptionParams.discounts = [
      {
        coupon: couponId, // Replace couponId with the actual coupon value
      },
    ];
  }
  
  // Create the subscription
  const subscription = await stripe.subscriptions.create(subscriptionParams);
  
  const updateData = {
    isPayment: true,
    subscriptionId: subscription.id,
    subscriptionPlane:planType,
    priceId: priceId,
    
  };
  await User.findByIdAndUpdate(userInfo._id, updateData);

  const returnData={
    subscriptionPlane: planType,
    subtotal: subscription?.latest_invoice?.subtotal|| null,
    total: subscription?.latest_invoice?.total || null,
    discount:subscription?.latest_invoice?.total_discount_amounts[0]?.amount|| null,
    discountPercent:subscription?.latest_invoice?.discount?.coupon?.percent_off|| null
  }
  
  return returnData;
};

// const createSubscriptionInStripe=async(payload:any)=>{

// }

const cancelSubscriptionInStripe = async (subscriptionId: string, user:JwtPayload) => {
  const cancelSubcription = await stripe.subscriptions.cancel(subscriptionId);
  const updateData = {
    isPayment: false,
    subscriptionId: "",
    subscriptionPlane:"",
    priceId: "",
    
  };
  await User.findByIdAndUpdate(user.userId, updateData);
  return cancelSubcription;
};

const updateSubscriptionInStripe = async (payload: any, userId: string) => {
  const { paymentMethodId,planType } = payload;
  const userInfo = await User.findById(userId);
  
  if (!userInfo) {
    throw new AppError(404, "User not found");
  }
  const customerId = userInfo?.customerId as string;

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

const createCoupon = async ()=>{
  console.log("createCoupon")
}
export const paymentServices = {

  createSubscriptionInStripe,
  cancelSubscriptionInStripe,
  updateSubscriptionInStripe,
  createCoupon
};
