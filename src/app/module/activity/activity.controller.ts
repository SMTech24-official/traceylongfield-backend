import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { activityServices } from "./activity.services";

const getAllMyNotifications = catchAsync(async (req, res) => {
    
    const result = await activityServices.getAllMyNotifications(req.user);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Get all notification!',
      data: result,
    });
  });

  export const activityController={
    getAllMyNotifications
  }