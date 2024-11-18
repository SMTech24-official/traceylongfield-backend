import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { authorGuideService } from "./authorGuide.services";

const addAuthorGuide = catchAsync(async (req, res) => {
  const result = await authorGuideService.addAuthorGuide(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "add author guide successfully!",
    data: result,
  });
});
// get all author guide
const getAllAuthorGuides = catchAsync(async (req, res) => {
  const result = await authorGuideService.getAllAuthorGuides();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "get all author guide successfully!",
    data: result,
  });
});
// get single author guide
const getAuthorGuideById = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await authorGuideService.getAuthorGuideById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "get single author guide successfully!",
    data: result,
  });
});

//update author guide
const updateAuthorGuide = catchAsync(async (req, res) => {
  const result = await authorGuideService.updateAuthorGuide(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "update author guide successfully!",
    data: result,
  });
});
// delete author guide

const deleteAuthorGuide = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await authorGuideService.deleteAuthorGuide(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "delete author guide successfully!",
    data: result,
  });
});
export const authorGuideController = {
  addAuthorGuide,
  getAllAuthorGuides,
  getAuthorGuideById,
  updateAuthorGuide,
  deleteAuthorGuide
};
