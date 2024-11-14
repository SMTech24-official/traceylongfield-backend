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
const loginUser = async (payload: TLoginUser) => {
    // checking if the user is exist
    const user = await User.findOne({ email: payload.email })

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
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
        userId: user._id,
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
    const user = await User.findOne({ email: userData.email })

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
    }
    // checking if the user is already deleted

    const isVerified = user?.isVerified;

    if (!isVerified) {
        throw new AppError(httpStatus.FORBIDDEN, 'This user is not active!');
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
        email: user.email,
        userId: user.id,
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


    const jwtPayload = {
        email: user.email,
        userId: user.id,
        role: user.role,
    };

    const resetToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        '10m',
    );

    const resetUILink = `${config.activeLink}?id=${user.id}&token=${resetToken} `;

 //   sendEmail(user.email, resetUILink);


};

const resetPassword = async (
    payload: { email: string, newPassword: string },
    token: string,
) => {
    // checking if the user is exist
    const user = await User.findOne({ email: payload.email })

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
    }
    // checking if the user is already deleted
    const isVerified = user?.isVerified;

    if (!isVerified) {
        throw new AppError(httpStatus.FORBIDDEN, 'This user is not activate!');
    }





    const decoded = jwt.verify(
        token,
        config.jwt_access_secret as string,
    ) as JwtPayload;

    //localhost:3000?id=A-0001&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJBLTAwMDEiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDI4NTA2MTcsImV4cCI6MTcwMjg1MTIxN30.-T90nRaz8-KouKki1DkCSMAbsHyb9yDi0djZU3D6QO4

    if (payload.email !== decoded.email) {
        throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden!');
    }

    //hash new password
    const newHashedPassword = await argon2.hash(payload.newPassword);

    await User.findOneAndUpdate(
        {
            id: decoded.userId,
            role: decoded.role,
        },
        {
            password: newHashedPassword,
            needsPasswordChange: false,
            passwordChangedAt: new Date(),
        },
    );
};

export const AuthServices = {
    loginUser,
    changePassword,
    refreshToken,
    forgetPassword,
    resetPassword,
};
