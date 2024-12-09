import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { couponService } from "./coupon.service";

const couponInsertInDB = catchAsync(async (req, res) => {

  const result = await couponService.couponInsertIntoDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'coupon created successfully!',
    data: result,
  });
});

export const couponController ={
 couponInsertInDB,
};
