import httpStatus from "http-status";
import config from "../../config";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import AppError from "../../errors/AppError";

const loginUser = catchAsync(async (req, res) => {
    const result = await AuthServices.loginUser(req.body);
    const { refreshToken, accessToken} = result;
  
    res.cookie('refreshToken', refreshToken, {
      secure: config.nodeEnv === 'production',
      httpOnly: true,
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User is logged in successfully!',
      data: {
        accessToken,
      },
    });
  });


  const changePassword = catchAsync(async (req, res) => {
    const { ...passwordData } = req.body;
  
    const result = await AuthServices.changePassword(req.user, passwordData);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Password is updated successfully!',
      data: result,
    });
  });
  
  const refreshToken = catchAsync(async (req, res) => {
    const { refreshToken } = req.cookies;
    const result = await AuthServices.refreshToken(refreshToken);
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Access token is retrieved successfully!',
      data: result,
    });
  });
  
  const forgetPassword = catchAsync(async (req, res) => {
    const email = req.body.email;
    const result = await AuthServices.forgetPassword(email);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Forgot otp send successfully!',
      data: result,
    });
  });
  
  
  const resetPassword = catchAsync(async (req, res) => {
    const result = await AuthServices.resetPassword(req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Password reset successfully!',
      data: result,
    });
  });
  const resendOtp = catchAsync(async (req, res) => {
    const email=req.body.email;
    const result = await AuthServices.resendOtp(email);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'OTP send successfully!',
      data: result,
    });
  });
  export const AuthControllers = {
    loginUser,
    changePassword,
    refreshToken,
    forgetPassword,
    resetPassword,
    resendOtp
  };