import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { userServices } from "./user.service";

const createUser= catchAsync(async (req, res) => {
  const query= req.query
 const result=await userServices.createUser(req.body,query) 
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User registered successfully. Please check your email for account activation.',
      data: result,
    });
  });


  const verifyOtp = catchAsync(async (req, res) => {
    const result = await userServices.verifyOtp(req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Otp verify successfully!",
      data: result,
    });
   
  }); 
  const updateUserProfile = catchAsync(async (req, res) => {
    const result = await userServices.updateUserProfile(req);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "update user profile successfully!",
      data: result,
    });
   
  }); 
  const getUserProfile = catchAsync(async (req, res) => {
    const result = await userServices.getUserProfile(req.user);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "get user profile successfully!",
      data: result,
    });
   
  }); 

  export const userController={
    createUser,
    verifyOtp,
    getUserProfile,
    updateUserProfile
  }
