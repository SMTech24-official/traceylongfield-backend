import { User } from "../module/users/user.model";
import { USER_ROLE } from "../utils/constant";
import * as argon2 from "argon2";
const payload: any = {
  fullName: "Super",
  reviewerName: "Admin",
  amazonCountry: "US",
  amazonAuthorPageLink: "http://",
    email: "akonhasan@gmail.com",
    phoneNumber: "1234567890",
    password: "123456",
    role: USER_ROLE.admin,
  };

  export const CreateAdmin=async()=>{
    const user=await User.findOne({email:payload.email});
    if(user){
      return
    }
    const hashedPassword = await argon2.hash(payload.password);
    const result=await User.create({...payload,password:hashedPassword,isVerified:true});
  }