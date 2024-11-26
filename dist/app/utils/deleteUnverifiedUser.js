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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUnverifiedUsers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const user_model_1 = require("../module/users/user.model");
const deleteUnverifiedUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    // delete unverified users check that their OtpExpires date
    try {
        const user = yield user_model_1.User.find({
            otpExpires: { $lt: new Date() },
            isVerified: false,
        });
        if (user.length > 0) {
            const deleteCount = yield user_model_1.User.deleteMany({
                otpExpires: { $lt: new Date() },
                isVerified: false,
            });
        }
        return;
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, error.message);
    }
});
exports.deleteUnverifiedUsers = deleteUnverifiedUsers;
