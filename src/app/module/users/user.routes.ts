import { Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../../utils/constant";
import { fileUploader } from "../../helpers/fileUpload";

const router=Router()
router.post("/register",userController.createUser)
router.get("/get-me",auth(USER_ROLE.admin,USER_ROLE.author,USER_ROLE.superAdmin),userController.getUserProfile)
router.post("/verify-otp", userController.verifyOtp);
router.patch("/update-profile",fileUploader.uploadSingle, userController.updateUserProfile)
// get all user 

router.get("/get-all-users",auth(USER_ROLE.admin,USER_ROLE.superAdmin),userController.getAllUsers)
export const UserRoutes=router