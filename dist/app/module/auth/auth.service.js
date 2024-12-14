"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = require("../users/user.model");
const matchPassword_1 = require("../../utils/matchPassword");
const auth_utils_1 = require("./auth.utils");
const config_1 = __importDefault(require("../../config"));
const argon2 = __importStar(require("argon2"));
const sendEmail_1 = require("../../utils/sendEmail");
const crypto_1 = __importDefault(require("crypto"));
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the user is exist
    const user = yield user_model_1.User.findOne({ email: payload.email });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'This user is not found !');
    }
    if (!(user === null || user === void 0 ? void 0 : user.isPayment)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Your payment is not completed! Please complete your payment');
    }
    // checking if the user is already deleted
    const isVerified = user === null || user === void 0 ? void 0 : user.isVerified;
    if (!isVerified) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'This user is not verified!');
    }
    //checking if the password is correct
    if (!(yield argon2.verify(user.password, payload.password))) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Password do not matched');
    }
    //create token and sent to the  client
    const jwtPayload = {
        userId: user._id,
        name: user.fullName,
        profileImage: user.profileImage,
        email: user.email,
        role: user.role,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    const refreshToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_refresh_expires_in);
    return {
        accessToken,
        refreshToken,
    };
});
const changePassword = (userData, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the user is exist
    const user = yield user_model_1.User.findOne({ _id: userData.userId });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'This user is not found !');
    }
    // checking if the user is already deleted
    const isVerified = user === null || user === void 0 ? void 0 : user.isVerified;
    if (!isVerified) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'This user is not verified!');
    }
    //checking if the password is correct
    if (!(yield (0, matchPassword_1.matchPassword)(payload.oldPassword, user === null || user === void 0 ? void 0 : user.password)))
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Password do not matched');
    //hash new password
    const newHashedPassword = yield argon2.hash(payload.newPassword);
    yield user_model_1.User.findOneAndUpdate({
        _id: userData.userId,
        role: userData.role,
    }, {
        password: newHashedPassword,
    });
    return null;
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the given token is valid
    const decoded = (0, auth_utils_1.verifyToken)(token, config_1.default.jwt_access_secret);
    const { userId, iat } = decoded;
    // checking if the user is exist
    const user = yield user_model_1.User.findOne({ _id: userId });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'This user is not found !');
    }
    // checking if the user is already deleted
    const isVerified = user === null || user === void 0 ? void 0 : user.isVerified;
    if (!isVerified) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'This user is not active!');
    }
    const jwtPayload = {
        userId: user._id,
        name: user.fullName,
        profileImage: user.profileImage,
        email: user.email,
        role: user.role,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    return {
        accessToken,
    };
});
const forgetPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the user is exist
    const user = yield user_model_1.User.findOne({ email: email });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'This user is not found !');
    }
    // checking if the user is already deleted
    const isVerified = user === null || user === void 0 ? void 0 : user.isVerified;
    if (!isVerified) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'This user is not active !');
    }
    const otp = crypto_1.default.randomInt(1000, 9999).toString();
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
    yield (0, sendEmail_1.sendEmail)(user.email, html, "Forgot Password OTP");
    const updateUserProfile = yield user_model_1.User.findOneAndUpdate({ email: user.email }, { otp: otp, otpExpires: otpExpires, isVerified: false }, { new: true });
});
const resetPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the user is exist
    const user = yield user_model_1.User.findOne({ email: payload.email });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'This user is not found !');
    }
    // checking if the user is already deleted
    const isVerified = user === null || user === void 0 ? void 0 : user.isVerified;
    if (!isVerified) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Your OTP is not Verified!');
    }
    console.log(payload.newPassword);
    const newHashedPassword = yield argon2.hash(payload.newPassword.toString());
    console.log(newHashedPassword);
    console.log(user);
    const result = yield user_model_1.User.findOneAndUpdate({
        _id: user._id,
    }, {
        password: newHashedPassword,
    });
    if (!result) {
        throw new Error('Failed to update password');
    }
    console.log(result);
});
// resend OTP for verification
const resendOtp = (email) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the user is exist
    const user = yield user_model_1.User.findOne({ email: email });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'This user is not found!');
    }
    const otp = crypto_1.default.randomInt(1000, 9999).toString();
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
    yield (0, sendEmail_1.sendEmail)(user.email, html, "Resend OTP");
    const updateUserProfile = yield user_model_1.User.findOneAndUpdate({ _id: user._id }, { otp: otp, otpExpires: otpExpires, isVerified: false }, { new: true });
});
exports.AuthServices = {
    loginUser,
    changePassword,
    refreshToken,
    forgetPassword,
    resetPassword,
    resendOtp
};
