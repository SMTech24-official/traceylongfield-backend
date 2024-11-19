import { Router } from "express";
import { inviteController } from "./invite.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../../utils/constant";

const router=Router()

router.get("/",auth(USER_ROLE.admin,USER_ROLE.author),inviteController.getInvitationLink)





export const inviteRouter=router