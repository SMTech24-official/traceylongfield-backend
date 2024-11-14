import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { IUser } from "./user.interface";
import crypto from "crypto";
import * as argon2 from "argon2";
import { sendEmail } from "../../utils/sendEmail";
import config from "../../config";
import { User } from "./user.model";
import { Request } from "express";

const createUser = async (payload: IUser) => {
  payload.password = await argon2.hash(payload.password);
    // Generate a 6-digit OTP
    const otp = crypto.randomInt(1000, 9999).toString();

    // Set OTP expiration time to 5 minutes from now
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    payload.otp=otp
    payload.otpExpires=otpExpires
    payload.role = "author"
  const result = await User.create(payload)
if(!result){
  throw new AppError (httpStatus.NOT_ACCEPTABLE,"User create failed")
}


  

  const html = `
<div style="font-family: Arial, sans-serif; color: #333; padding: 30px; background: linear-gradient(135deg, #6c63ff, #3f51b5); border-radius: 8px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px;">
        <h2 style="color: #ffffff; font-size: 28px; text-align: center; margin-bottom: 20px;">
            <span style="color: #ffeb3b;">Email Verification</span>
        </h2>
        <p style="font-size: 16px; color: #333; line-height: 1.5; text-align: center;">
            Thank you for registering with us! Please verify your email address by using the OTP code below:
        </p>
        <p style="font-size: 32px; font-weight: bold; color: #ff4081; text-align: center; margin: 20px 0;">
            ${otp}
        </p>
        <div style="text-align: center; margin-bottom: 20px;">
            <p style="font-size: 14px; color: #555; margin-bottom: 10px;">
                This OTP will expire in <strong>5 minutes</strong>. If you did not request this, please ignore this email.
            </p>
            <p style="font-size: 14px; color: #555; margin-bottom: 10px;">
                If you need assistance, feel free to contact us.
            </p>
        </div>
        <div style="text-align: center; margin-top: 30px;">
            <p style="font-size: 12px; color: #999; text-align: center;">
                Best Regards,<br/>
                <span style="font-weight: bold; color: #3f51b5;">Booksy.buzz Team</span><br/>
                <a href="mailto:support@booksy.buzz.com" style="color: #ffffff; text-decoration: none; font-weight: bold;">Contact Support</a>
            </p>
        </div>
    </div>
</div>

  `;

  // Send the OTP to user's email
  await sendEmail(result.email, html, "Verifications mail");


  const { password, ...rest } = result.toObject()
  return rest

}
const createAdmin = async (payload: IUser) => {
  payload.password = await argon2.hash(payload.password);
  payload.role = "admin"
  const result = await User.create(payload)
  if (result) {
    const resetUILink = `${config.activeLink}?id=${result._id}`
    // const resetUILink = `<button onclick=()=>(console.l)>Active account</button>`
    // sendEmail(payload.email, `
    //   <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    //       <p>Dear</p>
    //       <p>You Need to active your Account:</p>
    //       <a href="${resetUILink}" style="text-decoration: none;">
    //         <button style="background-color: #007BFF; color: white; padding: 10px 20px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer;">
    //           active account
    //         </button>
    //       </a>
    //       <p>Thank you,<br>Dream 2 Drive</p>
    //       </div>

    //   `);
  }
  const { password, ...rest } = result.toObject()
  return rest

}

const verifyOtp = async (payload: { email: string; otp: string }) => {
  // checking if the user is exist
  const user = await User.findOne({ email: payload.email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
  }
  // checking if the user is already deleted
  const isVerified = user?.isVerified;
  if (isVerified) {
    throw new AppError(httpStatus.FORBIDDEN, "Your are already verified");
  }

  // Check if the OTP is valid and not expired
  if (
    user.otp !== payload.otp ||
    !user.otpExpires ||
    user.otpExpires < new Date()
  ) {
    throw new AppError(httpStatus.BAD_REQUEST, "invalid OTP");
  }
  // Step 5: Update the user's password, reset OTP and expiration in the database
  await User.findOneAndUpdate(
    { email: payload.email, _id: user._id }, // Matching by email and user ID
    {
  // Set the new hashed password
      otp: "",                // Clear the OTP
      otpExpires: "", 
      isVerified:true             // Clear the OTP expiration
    },
    { runValidators: true }        // Ensure validators run on the update
  );

  return{massage:"Otp verification successful"}
};
// update user profile 
const updateUserProfile =async (req:Request)=>{
console.log(req.user,req.file)
}
export const userServices = {
  createUser,
  verifyOtp,
  createAdmin,
  updateUserProfile
};
