import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { inviteService } from "./invite.services";

const getInvitationLink = catchAsync(async (req, res) => {
    const result = await inviteService.getInvitationLink(req.user);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "get invitation link successfully!",
      data: result,
    });
   
  }); 
  export const inviteController={
    getInvitationLink
  }

  