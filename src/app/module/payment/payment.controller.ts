import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { paymentServices } from "./payment.services";
import { JwtPayload } from "jsonwebtoken";
const createSubscription = catchAsync(async (req, res) => {
  const subcription = await paymentServices.createSubscriptionInStripe(
    req.body
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Subcription created successfully",
    data: subcription,
  });
});

const cancelSubscription = catchAsync(async (req, res) => {
  const { subscriptionId } = req.body;
  const user=req.user
  const result = await paymentServices.cancelSubscriptionInStripe(
    subscriptionId,user as JwtPayload
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Subscription cancelled successfully",
    data: result,
  });
});

const updateSubscription = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  
  const result = await paymentServices.updateSubscriptionInStripe(
    req.body,
    userId
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Subscription updated successfully",
    data: result,
  });
});
const createCoupon = catchAsync(async (req, res) => {
  const userId = req.user.userId;
 
  const result = await paymentServices.createCoupon();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Subscription updated successfully",
    data: result,
  });
});

export const paymentController = {
  createSubscription,
  cancelSubscription,
  updateSubscription,
  createCoupon
};
