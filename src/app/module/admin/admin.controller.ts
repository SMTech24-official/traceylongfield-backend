import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { adminServices } from "./admin.services";


const createAdmin= catchAsync(async (req, res) => {
    const result=await adminServices.createAdmin(req.body) 
     
       sendResponse(res, {
         statusCode: httpStatus.OK,
         success: true,
         message: 'User registered successfully. Please check your email for account activation.',
         data: result,
       });
     });
const getAllPendingBook = catchAsync(async (req, res) => {
  
    const result = await adminServices.getAllPendingBook();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "get all pending  book successfully!",
      data: result,
    });
  });
const getSingleBook = catchAsync(async (req, res) => {
  const id =req.params.id;
    const result = await adminServices.getSingleBook(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "get all pending  book successfully!",
      data: result,
    });
  });
  export const adminController={
    getAllPendingBook,
    createAdmin,
    getSingleBook
  }