import { JwtPayload } from "jsonwebtoken"
import { createToken } from "../auth/auth.utils";
import config from "../../config";


const getInvitationLink=async(user:JwtPayload)=>{
    const{userId,email,role}=user;
    // generate token 
    const token=createToken({userId,email,role},config.jwt_access_secret as string,"365d");
 const link=`${config.front_end_base_url}/signup?token=${token}`
 return link
}


export const inviteService={
    getInvitationLink,
}