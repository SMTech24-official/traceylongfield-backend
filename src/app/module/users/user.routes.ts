import { Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../../utils/constant";
import { fileUploader } from "../../helpers/fileUpload";

const router=Router()
router.post("/register",userController.createUser)
router.get("/get-me",auth(USER_ROLE.admin,USER_ROLE.author,USER_ROLE.superAdmin),userController.getUserProfile)
router.post("/verify-otp", userController.verifyOtp);
router.patch("/update-profile",auth(USER_ROLE.author,USER_ROLE.admin),fileUploader.uploadSingle, userController.updateUserProfile)

export const UserRoutes=router