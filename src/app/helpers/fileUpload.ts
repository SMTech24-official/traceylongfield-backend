import multer from "multer";
import path from "path";
import config from "../config";
import { v2 as cloudinary } from 'cloudinary';
import fs from "fs/promises";
import { S3Client, PutObjectCommand, ObjectCannedACL } from "@aws-sdk/client-s3";
import sharp from "sharp";  // Import sharp for image processing

// Define the type for the file upload response from DigitalOcean Spaces
interface UploadResponse {
  Location: string; // This will store the formatted URL with "https://"
  Bucket: string;
  Key: string;
  ETag?: string;
}

// /var/www/uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
   // cb(null, path.join(process.cwd(), "uploads"));
   cb(null, path.join('/var/www', "uploads"));
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
  api_secret: config.cloudinary_api_secret,
});

// Configure DigitalOcean Spaces
const s3Client = new S3Client({
  region: "us-east-1",
  endpoint: process.env.DO_SPACE_ENDPOINT,
  credentials: {
    accessKeyId: process.env.DO_SPACE_ACCESS_KEY || "",
    secretAccessKey: process.env.DO_SPACE_SECRET_KEY || "",
  },
});

// Upload file to DigitalOcean Spaces with image compression
const uploadToDigitalOcean = async (
  file: Express.Multer.File
): Promise<UploadResponse> => {
  if (!file) {
    throw new Error("File is required for uploading.");
  }

  try {
    // Ensure the file exists before attempting to upload it
    await fs.access(file.path);

    // const compressedImageBuffer = await sharp(file.path)
    // .resize({
    //   width: 1500, // Resize to max width of 1500px (proportional resize)
    //   withoutEnlargement: true, // Prevent enlarging smaller images
    // })
    // .withMetadata() // Retain original metadata (like orientation)
    // .toBuffer(); // Convert to buffer for upload

    // Prepare file upload parameters
    const Key = `buksybuzz/${Date.now()}_${file.originalname}`;
    const uploadParams = {
      Bucket: process.env.DO_SPACE_BUCKET || "",
      Key,
      Body:  await fs.readFile(file.path),  // Upload the compressed image buffer
      ACL: "public-read" as ObjectCannedACL,
      ContentType: file.mimetype,
    };

    // Upload file to DigitalOcean Space
    await s3Client.send(new PutObjectCommand(uploadParams));

    // Safely remove the file from local storage after upload
    await fs.unlink(file.path);

    // Format the URL to include "https://"
    const fileURL = `${process.env.DO_SPACE_ENDPOINT}/${process.env.DO_SPACE_BUCKET}/${Key}`;
    return {
      Location: fileURL,
      Bucket: process.env.DO_SPACE_BUCKET || "",
      Key,
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const fileUploader = {
  upload,
  uploadSingle,
  uploadMultiple,
  uploadGuide,
  uploadToDigitalOcean,
};
