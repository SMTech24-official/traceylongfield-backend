import { JwtPayload } from "jsonwebtoken";
import { IAuthUser } from "../users/user.interface";
import { Notification } from "./activity.model";

const getAllMyNotifications=async(user:JwtPayload)=>{
const result=await Notification.find({user:user.userId}).sort({createdAt:"desc"}).populate("user","-password")
return result

}

export const activityServices={
    getAllMyNotifications
}