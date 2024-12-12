import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { User } from "../users/user.model";
import { TLoginUser } from "./auth.interface";
import { matchPassword } from "../../utils/matchPassword";
import { createToken, verifyToken } from "./auth.utils";
import config from "../../config";
import jwt, { JwtPayload } from "jsonwebtoken";
import * as argon2 from "argon2";
import { sendEmail } from "../../utils/sendEmail";
import crypto from "crypto";
import { ObjectId } from 'mongoose';
import { CloudFormation } from "aws-sdk";
const loginUser = async (payload: TLoginUser) => {
    // checking if the user is exist
    const user = await User.findOne({ email: payload.email })

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
    }
   
    if(!user?.isPayment){
        throw new AppError(httpStatus.BAD_REQUEST, 'Your payment is not completed! Please complete your payment');
      }
    // checking if the user is already deleted

    const isVerified = user?.isVerified;

    if (!isVerified) {
        throw new AppError(httpStatus.FORBIDDEN, 'This user is not verified!');
    }


    //checking if the password is correct

    if (!await argon2.verify(user.password,payload.password)) {
       
        throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');
    }
    //create token and sent to the  client

    const jwtPayload = {
        userId:user._id,
        name:user.fullName,
        profileImage:user.profileImage,
        email: user.email,
        role: user.role,
    };

    const accessToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as string,
    );

    const refreshToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_refresh_expires_in as string,
    );

    return {
        accessToken,
        refreshToken,

    };
};

const changePassword = async (
    userData: JwtPayload,
    payload: { oldPassword: string; newPassword: string },
) => {
    // checking if the user is exist
    const user = await User.findOne({ _id: userData.userId })

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
    }
    // checking if the user is already deleted

    const isVerified = user?.isVerified;

    if (!isVerified) {
        throw new AppError(httpStatus.FORBIDDEN, 'This user is not verified!');
    }



    //checking if the password is correct

    if (!(await matchPassword(payload.oldPassword, user?.password)))
        throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');

    //hash new password
    const newHashedPassword = await argon2.hash(payload.newPassword);
    await User.findOneAndUpdate(
        {
            _id: userData.userId,
            role: userData.role,
        },
        {
            password: newHashedPassword,
        },
    );

    return null;
};

const refreshToken = async (token: string) => {
    // checking if the given token is valid
    const decoded = verifyToken(token, config.jwt_access_secret as string);

    const { userId, iat } = decoded;

    // checking if the user is exist
    const user = await User.findOne({ _id: userId })

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
    }
    // checking if the user is already deleted
    const isVerified = user?.isVerified;

    if (!isVerified) {
        throw new AppError(httpStatus.FORBIDDEN, 'This user is not active!');
    }





    const jwtPayload = {
        userId: user._id,
        name:user.fullName,
        profileImage:user.profileImage,
        email: user.email,
        role: user.role,
    };

    const accessToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as string,
    );

    return {
        accessToken,
    };
};

const forgetPassword = async (email: string) => {
    // checking if the user is exist
    const user = await User.findOne({ email: email })

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
    }
    // checking if the user is already deleted
    const isVerified = user?.isVerified;

    if (!isVerified) {
        throw new AppError(httpStatus.FORBIDDEN, 'This user is not active !');
    }


    const otp = crypto.randomInt(1000, 9999).toString();

    // Set OTP expiration time to 5 minutes from now
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    
    const html = `
    <div style="font-family: Arial, sans-serif; color: #333; padding: 30px; background: linear-gradient(135deg, #6c63ff, #3f51b5); border-radius: 8px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px;">
            <h2 style="color: #ffffff; font-size: 28px; text-align: center; margin-bottom: 20px;">
                <span style="color: #ffeb3b;">Forgot password otp</span>
            </h2>
            <p style="font-size: 16px; color: #333; line-height: 1.5; text-align: center;">
                Forgot password otp code below
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
                    <a href="mailto:booksy.buzz@gmail.com" style="color: #ffffff; text-decoration: none; font-weight: bold;">Contact Support</a>
                </p>
            </div>
        </div>
    </div> `;

  // Send the OTP to user's email
  await sendEmail(user.email, html, "Forgot Password OTP");
  const updateUserProfile=await  User.findOneAndUpdate({email: user.email},{otp:otp,otpExpires:otpExpires,isVerified:false},{new:true});

};

const resetPassword = async (
    payload: { email: string, newPassword: string }
) => {
    // checking if the user is exist
    const user = await User.findOne({ email: payload.email })

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
    }
    // checking if the user is already deleted
    const isVerified = user?.isVerified;

    if (!isVerified) {
        throw new AppError(httpStatus.FORBIDDEN, 'Your OTP is not Verified!');
    }
    console.log(payload.newPassword)

const newHashedPassword = await argon2.hash(payload.newPassword.toString());

console.log(newHashedPassword)
console.log(user)

   const result= await User.findOneAndUpdate(
        {
            _id: user._id,
            
        },
        {
            password: newHashedPassword,
          
        },
    );
    if(!result){
        throw new Error('Failed to update password');
    }
    console.log(result)
};

// resend OTP for verification
    const resendOtp = async (email: string) => {
        // checking if the user is exist
        const user = await User.findOne({ email: email })
      
        if (!user) {
            throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
        }
        const otp = crypto.randomInt(1000, 9999).toString();

        // Set OTP expiration time to 5 minutes from now
        const otpExpires = new Date(Date.now() + 5 * 60 * 1000);
        const html = `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 30px; background: linear-gradient(135deg, #6c63ff, #3f51b5); border-radius: 8px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px;">
                <h2 style="color: #ffffff; font-size: 28px; text-align: center; margin-bottom: 20px;">
                    <span style="color: #ffeb3b;">Resend OTP</span>
                </h2>
                <p style="font-size: 16px; color: #333; line-height: 1.5; text-align: center;">
                    Here is your new OTP code to complete the process.
                </p>
                <p style="font-size: 32px; font-weight: bold; color: #ff4081; text-align: center; margin: 20px 0;">
                    ${otp}
                </p>
                <div style="text-align: center; margin-bottom: 20px;">
                    <p style="font-size: 14px; color: #555; margin-bottom: 10px;">
                        This OTP will expire in <strong>5 minutes</strong>. If you did not request this, please ignore this email.
                    </p>
                    <p style="font-size: 14px; color: #555; margin-bottom: 10px;">
                        If you need further assistance, feel free to contact us.
                    </p>
                </div>
                <div style="text-align: center; margin-top: 30px;">
                    <p style="font-size: 12px; color: #999; text-align: center;">
                        Best Regards,<br/>
                        <span style="font-weight: bold; color: #3f51b5;">Booksy.buzz Team</span><br/>
                        <a href="mailto:booksy.buzz@gmail.com" style="color: #ffffff; text-decoration: none; font-weight: bold;">Contact Support</a>
                    </p>
                </div>
            </div>
        </div> `;
    ;
    
      // Send the OTP to user's email
      await sendEmail(user.email, html, "Resend OTP");
      const updateUserProfile=await  User.findOneAndUpdate({_id: user._id},{otp:otp,otpExpires:otpExpires,isVerified:false},{new:true});
    
    }
export const AuthServices = {
    loginUser,
    changePassword,
    refreshToken,
    forgetPassword,
    resetPassword,
    resendOtp
};
