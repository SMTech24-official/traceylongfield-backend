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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userServices = void 0;
const auth_utils_1 = require("./../auth/auth.utils");
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const crypto_1 = __importDefault(require("crypto"));
const argon2 = __importStar(require("argon2"));
const sendEmail_1 = require("../../utils/sendEmail");
const config_1 = __importDefault(require("../../config"));
const user_model_1 = require("./user.model");
const createUser = (payload, query) => __awaiter(void 0, void 0, void 0, function* () {
    payload.password = yield argon2.hash(payload.password);
    // Generate a 6-digit OTP
    const otp = crypto_1.default.randomInt(1000, 9999).toString();
    // Set OTP expiration time to 5 minutes from now
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    payload.otp = otp;
    payload.otpExpires = otpExpires;
    payload.role = "author";
    const result = yield user_model_1.User.create(payload);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, "User create failed");
    }
    if (query.token) {
        const token = query.token;
        const data = (0, auth_utils_1.verifyToken)(token, config_1.default.jwt_access_secret);
        const existingUser = yield user_model_1.User.findOne({ _id: data.userId });
        if (!existingUser) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, "refer user not found");
        }
        const updateDoc = {
            invitedFriends: existingUser.invitedFriends + 1,
            points: existingUser.points + 50
        };
        yield user_model_1.User.findByIdAndUpdate({ _id: existingUser._id }, updateDoc, { runValidators: true });
        yield user_model_1.User.findByIdAndUpdate({ _id: result._id }, { points: 50 }, { runValidators: true });
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
    yield (0, sendEmail_1.sendEmail)(result.email, html, "Verifications mail");
    const _a = result.toObject(), { password } = _a, rest = __rest(_a, ["password"]);
    return rest;
});
const verifyOtp = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the user is exist
    const user = yield user_model_1.User.findOne({ email: payload.email });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "This user is not found !");
    }
    // checking if the user is already deleted
    const isVerified = user === null || user === void 0 ? void 0 : user.isVerified;
    if (isVerified) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Your are already verified");
    }
    // Check if the OTP is valid and not expired
    if (user.otp !== payload.otp ||
        !user.otpExpires ||
        user.otpExpires < new Date()) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "invalid OTP");
    }
    // Step 5: Update the user's password, reset OTP and expiration in the database
    yield user_model_1.User.findOneAndUpdate({ email: payload.email, _id: user._id }, // Matching by email and user ID
    {
        // Set the new hashed password
        otp: "", // Clear the OTP
        otpExpires: "",
        isVerified: true // Clear the OTP expiration
    }, { runValidators: true } // Ensure validators run on the update
    );
    return { massage: "Otp verification successful" };
});
// update user profile 
const updateUserProfile = (req) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.data) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid request body");
    }
    const file = req.file;
    const body = JSON.parse(req.body.data);
    if (!file) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "File is required for organization image");
    }
    const payload = Object.assign(Object.assign({ _id: req.user.userId }, body), { profileImage: `${config_1.default.back_end_base_url}/uploads/${file === null || file === void 0 ? void 0 : file.originalname}` });
    const result = yield user_model_1.User.findByIdAndUpdate(req.user.userId, payload, { new: true }).select("-password");
    return result;
});
exports.userServices = {
    createUser,
    verifyOtp,
    updateUserProfile
};
