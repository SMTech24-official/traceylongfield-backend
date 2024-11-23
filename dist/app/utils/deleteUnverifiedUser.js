"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUnverifiedUsers = void 0;
const user_model_1 = require("../module/users/user.model");
const deleteUnverifiedUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    // delete unverified users check that their OtpExpires date 
    try {
        const deleteCount = yield user_model_1.User.deleteMany({ otpExpires: { $lt: new Date() }, isVerified: false });
        console.log(`${deleteCount.deletedCount} expired OTP records were deleted.`);
    }
    catch (error) {
        console.error("Error deleting expired OTPs:", error);
    }
});
exports.deleteUnverifiedUsers = deleteUnverifiedUsers;
