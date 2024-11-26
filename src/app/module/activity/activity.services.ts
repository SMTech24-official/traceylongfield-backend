import { JwtPayload } from "jsonwebtoken";
import { IAuthUser } from "../users/user.interface";

const getAllMyNotifications=async(user:JwtPayload)=>{
console.log("getAllMyNotifications")

}

export const activityServices={
    getAllMyNotifications
}