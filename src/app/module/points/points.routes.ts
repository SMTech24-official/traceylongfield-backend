import { Router } from "express";
import { pointController } from "./points.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../../utils/constant";

const router=Router();

router.post("/add-point",pointController.addPointWithType)
router.post("/add-many",pointController.addMany)
// get all points list

router.get("/",pointController.getAllPoints)

// get single point 

router.get("/:id",pointController.getSinglePoint)
// update point 

router.patch("/:id",auth(USER_ROLE.admin), pointController.updatePoint)
// delete point

router.delete("/:id",auth(USER_ROLE.admin), pointController.deletePoint)
export const PointRouter=router