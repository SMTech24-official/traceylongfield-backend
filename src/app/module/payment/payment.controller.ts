import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { paymentServices } from "./payment.services";
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
  const result = await paymentServices.cancelSubscriptionInStripe(
    subscriptionId
  );

  sendResponse(res, {
    statusCode: 200,
    success: false,
    message: "Subscription cancelled successfully",
    data: result,
  });
});

const updateSubscription = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  console.log(req.body)
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

  export const paymentController={
    createSubscription,
    cancelSubscription,
    updateSubscription
  }