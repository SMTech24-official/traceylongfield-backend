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
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = require("./user.model");
const argon2 = __importStar(require("argon2"));
const sendEmail_1 = require("../../utils/sendEmail");
const config_1 = __importDefault(require("../../config"));
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    payload.password = yield argon2.hash(payload.password);
    const result = yield user_model_1.User.create(payload);
    const resetUILink = `${config_1.default.activeLink}?id=${result._id}`;
    // const resetUILink = `<button onclick=()=>(console.l)>Active account</button>`
    yield (0, sendEmail_1.sendEmail)(payload.email, `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <p>Dear</p>
          <p>You Need to active your Account:</p>
          <a href="${resetUILink}" style="text-decoration: none;">
            <button style="background-color: #007BFF; color: white; padding: 10px 20px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer;">
              active account
            </button>
          </a>
          <p>Thank you,<br>Dream 2 Drive</p>
          </div>

      `);
    const _a = result.toObject(), { password } = _a, rest = __rest(_a, ["password"]);
    return rest;
});
const createAdmin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    payload.password = yield argon2.hash(payload.password);
    payload.role = "admin";
    const result = yield user_model_1.User.create(payload);
    if (result) {
        const resetUILink = `${config_1.default.activeLink}?id=${result._id}`;
        // const resetUILink = `<button onclick=()=>(console.l)>Active account</button>`
        (0, sendEmail_1.sendEmail)(payload.email, `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <p>Dear</p>
          <p>You Need to active your Account:</p>
          <a href="${resetUILink}" style="text-decoration: none;">
            <button style="background-color: #007BFF; color: white; padding: 10px 20px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer;">
              active account
            </button>
          </a>
          <p>Thank you,<br>Dream 2 Drive</p>
          </div>

      `);
    }
    const _a = result.toObject(), { password } = _a, rest = __rest(_a, ["password"]);
    return rest;
});
const activeAccount = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ _id: id });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not Found");
    }
    if (user === null || user === void 0 ? void 0 : user.isActive) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, "You account is already actived");
    }
    yield user_model_1.User.findOneAndUpdate({ _id: id }, { isActive: true });
    return { message: "Your account active successfully" };
});
exports.userServices = {
    createUser,
    activeAccount,
    createAdmin
};
