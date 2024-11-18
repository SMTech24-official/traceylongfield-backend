import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { knowledgeHubService } from "./knowledgeHub.services";

const addKnowledgeHubVideo = catchAsync(async (req, res) => {
const data=req.body
    const result = await knowledgeHubService.addKnowledgeHubVideo(data);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "video link add  successfully!",
      data: result,
    });
  });
// delete video
  const deleteKnowledgeHubVideo = catchAsync(async (req, res) => {
    const id = req.params.id;
    const result = await knowledgeHubService.deleteKnowledgeHubVideo(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "video link deleted successfully!",
      data: result,
    });
  });
  // get video
  const getKnowledgeHubVideo = catchAsync(async (req, res) => {
    const id = req.params.id;
    const result = await knowledgeHubService.getKnowledgeHubVideo();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "video link get successfully!",
      data: result,
    });
  });
  // update video 
  const updateKnowledgeHubVideo = catchAsync(async (req, res) => {
    const id = req.params.id;
    const data=req.body
    const result = await knowledgeHubService.updateKnowledgeHubVideo(id,data);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "video link updated successfully!",
      data: result,
    });
  });
  
  export const knowledgeHubController={
    addKnowledgeHubVideo,
    deleteKnowledgeHubVideo,
    getKnowledgeHubVideo,
    updateKnowledgeHubVideo

  }