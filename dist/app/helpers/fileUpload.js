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
exports.fileUploader = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const config_1 = __importDefault(require("../config"));
const cloudinary_1 = require("cloudinary");
//import fs from 'fs'
const promises_1 = __importDefault(require("fs/promises"));
const client_s3_1 = require("@aws-sdk/client-s3");
// /var/www/uploads
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        //cb(null, path.join(process.cwd(), "/var/www/uploads"));
        cb(null, path_1.default.join(process.cwd(), "uploads"));
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
const upload = (0, multer_1.default)({ storage: storage });
// upload single image
const uploadSingle = upload.single("image");
// upload multiple image
const uploadMultiple = upload.fields([
    { name: "bookCover", maxCount: 1 },
    { name: "bookPdf", maxCount: 1 },
]);
// upload multiple image
const uploadGuide = upload.fields([
    { name: "cover", maxCount: 1 },
    { name: "pdfFile", maxCount: 1 },
]);
cloudinary_1.v2.config({
    cloud_name: 'dezfej6wq',
    api_key: config_1.default.cloudinary_api_key,
    api_secret: config_1.default.cloudinary_api_secret
});
// Configure DigitalOcean Spaces
const s3Client = new client_s3_1.S3Client({
    region: "us-east-1",
    endpoint: process.env.DO_SPACE_ENDPOINT,
    credentials: {
        accessKeyId: process.env.DO_SPACE_ACCESS_KEY || "",
        secretAccessKey: process.env.DO_SPACE_SECRET_KEY || "",
    },
});
// const uploadToCloudinary = async (file: Express.Multer.File): Promise<any> => {
//   return new Promise((resolve, reject) => {
//     cloudinary.uploader.upload(
//       file.path,
//       { resource_type: 'auto' }, // Auto-detect file type
//       (error, result) => {
//         // Delete the local file after uploading
//         fs.unlinkSync(file.path);
//         if (error) {
//           reject(error);
//         } else {
//           resolve(result);
//         }
//       }
//     );
//   });
// };
// Upload file to DigitalOcean Spaces
const uploadToDigitalOcean = (file) => __awaiter(void 0, void 0, void 0, function* () {
    if (!file) {
        throw new Error("File is required for uploading.");
    }
    try {
        // Ensure the file exists before attempting to upload it
        yield promises_1.default.access(file.path);
        // Prepare file upload parameters
        const Key = `buksybuzz/${Date.now()}_${file.originalname}`;
        const uploadParams = {
            Bucket: process.env.DO_SPACE_BUCKET || "",
            Key,
            Body: yield promises_1.default.readFile(file.path),
            ACL: "public-read",
            ContentType: file.mimetype,
        };
        // Upload file to DigitalOcean Space
        yield s3Client.send(new client_s3_1.PutObjectCommand(uploadParams));
        // Safely remove the file from local storage after upload
        // await fs.unlink(file.path);
        // Format the URL to include "https://"
        const fileURL = `${process.env.DO_SPACE_ENDPOINT}/${process.env.DO_SPACE_BUCKET}/${Key}`;
        return {
            Location: fileURL,
            Bucket: process.env.DO_SPACE_BUCKET || "",
            Key,
        };
    }
    catch (error) {
        console.error("Error uploading file:", error);
        throw error;
    }
});
exports.fileUploader = {
    upload,
    uploadSingle,
    uploadMultiple,
    uploadGuide,
    // uploadToCloudinary,
    uploadToDigitalOcean
};
