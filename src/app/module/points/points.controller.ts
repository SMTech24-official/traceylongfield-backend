import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { pointService } from "./points.serveces";
import { IPoints } from "./points.interface";

const addPointWithType = catchAsync(async (req, res) => {
   const data=req.body
    const result = await pointService.addPointWithType(data)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "update review successfully!",
      data: result,
    });
  });
const addMany = catchAsync(async (req, res) => {
   const data=req.body
    const result = await pointService.addMany(data as IPoints[])
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "update review successfully!",
      data: result,
    });
  });
// get all points list 
  const getAllPoints = catchAsync(async (req, res) => {
    const result = await pointService.getAllPoints()
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "get all points successfully!",
      data: result,
    });
  });
  // get single point 
  const getSinglePoint = catchAsync(async (req, res) => {
    const id =req.params.id
    const result = await pointService.getSinglePoint(id)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "get single point successfully!",
      data: result,
    });
  });
  // update point 
  
  const updatePoint = catchAsync(async (req, res) => {
    const id =req.params.id
    const data=req.body
    const result = await pointService.updatePoint(id,data)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "update point successfully!",
      data: result,
    });
  });
  // delete point
  const deletePoint = catchAsync(async (req, res) => {
    const id =req.params.id
    const result = await pointService.deletePoint(id)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "delete point successfully!",
      data: result,
    });
  });
  export const pointController={
    addPointWithType,
    getAllPoints,
    getSinglePoint,
    updatePoint,
    deletePoint,
    addMany
  }