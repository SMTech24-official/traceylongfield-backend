
import multer from "multer";
import path from "path";
import config from "../config";
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

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

cloudinary.config({ 
  cloud_name: 'dezfej6wq', 
  api_key: config.cloudinary_api_key, 
  api_secret:config.cloudinary_api_secret  // Click 'View API Keys' above to copy your API secret
});
const uploadToCloudinary = async (file: Express.Multer.File): Promise<any> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file.path,
      { resource_type: 'auto' }, // Auto-detect file type
      (error, result) => {
        // Delete the local file after uploading
        fs.unlinkSync(file.path);

        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};
export const fileUploader = {
  upload,
  uploadSingle,
  uploadMultiple,
  uploadGuide,
  uploadToCloudinary
};