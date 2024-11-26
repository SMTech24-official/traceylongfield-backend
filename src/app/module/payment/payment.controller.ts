import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { paymentService } from "./payment.services";

// Create a subscription
const createSubscription = catchAsync(async (req, res) => {
    const {plan}=req.query 
    const data=req.body
    const result = await paymentService.createSubscription(data );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Subscription created successfully",
      data: result,
    });
  });
// Create a subscription
const updateSubscriptionPlan = catchAsync(async (req, res) => {
    const {plan}=req.query 
    const data=req.body
    const result = await paymentService.updateSubscriptionPlan(data );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Subscription created successfully",
      data: result,
    });
  });



  
// Cancel a subscription
const cancelSubscription = catchAsync(async (req ,res) => {
    const { subscriptionId } = req.body;
  
    const {plan}=req.query 
    const result = await paymentService.cancelSubscription(subscriptionId );
  
    if (!result) {
      sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "Subscription not found or already canceled",
        data: null,
      });
      return;
    }
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Subscription canceled successfully",
      data: result,
    });
  });

  // Get all payments (subscriptions) from the database
const getAllPayments = catchAsync(async (req, res) => {
    const result = await paymentService.getAllPaymentDataIntoDB();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All payments retrieved successfully",
      data: result,
    });
  });
  
  // Hard delete payment by ID
  const deletePayment = catchAsync(async (req, res) => {
    const { id } = req.params;
  
    const result = await paymentService.deletePaymentDataFromDB(id);
  
    if (!result) {
      sendResponse(res, {
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "Payment record not found",
        data: null,
      });
      return;
    }
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Payment record deleted successfully",
      data: result,
    });
  });
  export const paymentController={
    createSubscription,
    cancelSubscription,
    deletePayment,
    getAllPayments,
    updateSubscriptionPlan
   
  }