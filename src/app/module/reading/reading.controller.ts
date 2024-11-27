import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { readingService } from "./reading.services";

const startReading = catchAsync(async (req, res) => {
  const bookId = req.params.id;
  const user = req.user;
  const result = await readingService.startReading(bookId, user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "start reading successfully!",
    data: result,
  });
});
const finishReading = catchAsync(async (req, res) => {
  const bookId = req.params.id;
  const user = req.user;
  const result = await readingService.finishReading(bookId, user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "start reading successfully!",
    data: result,
  });
});
const getToReviewedBook = catchAsync(async (req, res) => {
  const bookId = req.params.id;
  const user = req.user;
  const result = await readingService.getToReviewedBook(user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "get to be reviewed book successfully!",
    data: result,
  });
});
const getToReviewOverDueBook = catchAsync(async (req, res) => {
  const bookId = req.params.id;
  const user = req.user;
  const result = await readingService.getToReviewOverDueBook(user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "get reviewed over due book successfully!",
    data: result,
  });
});
const completeReview = catchAsync(async (req, res) => {
  const bookId = req.params.id;
  const user = req.user;
  const result = await readingService.completeReview(user, bookId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "get reviewed over due book successfully!",
    data: result,
  });
});
const getCompleteReview = catchAsync(async (req, res) => {
  const bookId = req.params.id;
  const user = req.user;
  const result = await readingService.getCompleteReview(user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "get reviewed over due book successfully!",
    data: result,
  });
});
const getSingleReview = catchAsync(async (req, res) => {
  const reviewId = req.params.id;
  const user = req.user;
  const result = await readingService.getSingleReview(user,reviewId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "get reviewed over due book successfully!",
    data: result,
  });
});
const myBookReviewHistory = catchAsync(async (req, res) => {
  const reviewId = req.params.id;
  const user = req.user;
  const result = await readingService.myBookReviewHistory(user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "get review successfully!",
    data: result,
  });
});
export const readingController = {
  startReading,
  finishReading,
  getToReviewedBook,
  getToReviewOverDueBook,
  completeReview,
  getCompleteReview,
  getSingleReview,
  myBookReviewHistory
};
