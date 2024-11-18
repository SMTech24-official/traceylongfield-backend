import { Router } from "express";
import { adminController } from "./admin.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../../utils/constant";
const router=Router();


router.post("/make-admin",auth(USER_ROLE.admin),adminController.createAdmin)
router.get("/",auth(USER_ROLE.admin), adminController.getAllPendingBook)
router.get("/:id",auth(USER_ROLE.admin), adminController.getSingleBook)
  //approved book 
  router.put("/approve/:id",auth(USER_ROLE.admin), adminController.approveBook)
  //rejected book
  router.put("/reject/:id",auth(USER_ROLE.admin), adminController.rejectBook)
  // get all review
  router.get("/review/all",auth(USER_ROLE.admin), adminController.getAllReview)
  // get single review
  router.get("/single-review/:id",auth(USER_ROLE.admin), adminController.getSingleReview)
// approved review
 router.put("/review/approve/:id",auth(USER_ROLE.admin), adminController.approvedReview)
  // rejected review
  router.delete("/review/rejected/:id",auth(USER_ROLE.admin), adminController.rejectReview)


export const AdminRouters=router