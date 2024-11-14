import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { userServices } from "./user.service";

const createUser= catchAsync(async (req, res) => {
 const result=await userServices.createUser(req.body) 
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User registered successfully. Please check your email for account activation.',
      data: result,
    });
  });
const createAdmin= catchAsync(async (req, res) => {
 const result=await userServices.createAdmin(req.body) 
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User registered successfully. Please check your email for account activation.',
      data: result,
    });
  });
const activeAccount= catchAsync(async (req, res) => {
  const id=req.query.id
 const result=await userServices.activeAccount(id) 
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'account activete successfully',
      data: result,
    });
  });
  

  export const userController={
    createUser,
    activeAccount,
    createAdmin
  }
