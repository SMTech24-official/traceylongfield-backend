import { JwtPayload } from "jsonwebtoken"
import { createToken } from "../auth/auth.utils";
import config from "../../config";


const getInvitationLink=async(user:JwtPayload)=>{
    const{userId,email,role}=user;
    // generate token 
    const token=createToken({userId,email,role},config.jwt_access_secret as string,"365d");
  console.log(token)
 
}


export const inviteService={
    getInvitationLink,
}