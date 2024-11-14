import { Router } from "express";
import { userController } from "./user.controller";

const router=Router()
router.post("/register",userController.createUser)
router.post("/make-admin",userController.createAdmin)
router.put("/active-account",userController.activeAccount)


export const UserRoutes=router