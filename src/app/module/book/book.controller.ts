import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { bookService } from "./book.services";

const insertBookIntoDB = catchAsync(async (req, res) => {
    const result = await bookService.insertBookIntoDB(req)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "added book successfully!",
      data: result,
    });
   
  });
// get all book with pagination and query by status
  const getAllMyBooks = catchAsync(async (req, res) => {
    const page =Number(req.query.page)|| 1;
    const limit = Number(req.query.limit) || 10;
    const status = req.query.status as string;
    const user=req.user
    const result = await bookService.getAllMyBooks(page, limit,status,user)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "get all my books successfully!",
      data: result,
    });
   
  });
// get all book with pagination and query by status
  const getAllBooks = catchAsync(async (req, res) => {
    const page =Number(req.query.page)|| 1;
    const limit = Number(req.query.limit) || 10;
    const genre=req.query.genre as string
    const user=req.user
    const result = await bookService.getAllBooks(page, limit,user,genre)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "get all books successfully!",
      data: result,
    });
   
  });
  // start reading


  export const bookController = {
    insertBookIntoDB,
    getAllMyBooks,
    getAllBooks,
  
  };