import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { homeReviewService } from "./homeReview.service";

const homeReviewInsertInDB = catchAsync(async (req, res) => {
  const result = await homeReviewService.createHomeReview(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'homeReview created successfully!',
    data: result,
  });
});
const updateHomeReview = catchAsync(async (req, res) => {
  const id =req.params.id
  const result = await homeReviewService.updateHomeReview(req , id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'homeReview created successfully!',
    data: result,
  });
});
const getAllHomeReviews = catchAsync(async (req, res) => {
  const result = await homeReviewService.getAllHomeReviews();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'homeReview get successfully!',
    data: result,
  });
});
const getHomeReviewById = catchAsync(async (req, res) => {
  const id =req.params.id
  const result = await homeReviewService.getHomeReviewById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'homeReview get successfully!',
    data: result,
  });
});
const deleteHomeReview = catchAsync(async (req, res) => {
  const id =req.params.id
  const result = await homeReviewService.deleteHomeReview(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'homeReview get successfully!',
    data: result,
  });
});

export const homeReviewController ={
 homeReviewInsertInDB,
 getAllHomeReviews,
 getHomeReviewById,
 updateHomeReview,
 deleteHomeReview
};
