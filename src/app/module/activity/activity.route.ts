import {Router} from "express"
import { activityController } from "./activity.controller"
import auth from "../../middlewares/auth"
import { USER_ROLE } from "../../utils/constant"
const router=Router()



router.get('/get-all/all',auth(USER_ROLE.admin,USER_ROLE.author,USER_ROLE.superAdmin), activityController.getAllMyNotifications)





export const activityRouter=router