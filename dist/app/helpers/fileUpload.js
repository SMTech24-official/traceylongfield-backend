"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileUploader = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
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
exports.fileUploader = {
    upload,
    uploadSingle,
    uploadMultiple,
    uploadGuide
};
