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
  //approved book 
  const approveBook = catchAsync(async (req, res) => {
    const id =req.params.id;
    const result = await adminServices.approveBook(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "book approved successfully!",
      data: result,
    });
  });
  //reject book
  const rejectBook = catchAsync(async (req, res) => {
    const id =req.params.id;
    const reason=req.body.reason
    const result = await adminServices.rejectBook(id,reason);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "book rejected successfully!",
      data: result,
    });
  });
  
  export const adminController={
    getAllPendingBook,
    createAdmin,
    getSingleBook,
    approveBook,
    rejectBook
  }