"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), ".env") });
exports.default = {
    port: process.env.PORT,
    dataBaseUrl: process.env.DATABASE_URL,
    nodeEnv: process.env.NODE_ENV,
    activeLink: process.env.ACTIVE_ACCOUNT_UI_LINK,
    jwt_access_secret: process.env.JWT_ACCESS_SECRET,
    jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
    jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
    mail: process.env.MAIL,
    mail_pass: process.env.MAIL_PASS,
    back_end_base_url: process.env.BACK_END_BASE_URL,
    stripe_secret_key: process.env.STRIPE_SECRET_KEY,
    front_end_base_url: process.env.FRONT_END_BASE_URL,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
    cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET
};
