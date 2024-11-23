import { Request } from "express"
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import config from "../../config";
import { Book } from "./book.model";
import { JwtPayload } from "jsonwebtoken";
import { Notification } from "../activity/activity.model";
import { fileUploader } from "../../helpers/fileUpload";
import { Point } from "../points/points.model";

const insertBookIntoDB=async(req:Request)=>{
  const user = req.user;
  const files = req.files as any;
  
  if (!files || !files.bookCover || !files.bookPdf) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "File is required to add book"
    );
  }
  
  if (!req.body.data) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid request body");
  }
  
  let bookData;
  try {
    bookData = JSON.parse(req.body.data);
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid JSON in request body");
  }
  
  // Helper function for uploading to Cloudinary
  // const uploadFileToCloudinary = async (file: Express.Multer.File): Promise<string> => {
  //   try {
  //     const result = await  fileUploader.uploadToCloudinary(file);
  //     return result.secure_url; // Return the Cloudinary secure URL
  //   } catch (error) {
  //     throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to upload file to Cloudinary");
  //   }
  // };
  
  // // Upload book cover and book PDF
  // let bookCoverUrl, bookPdfUrl;
  // try {
  //   bookCoverUrl = await uploadFileToCloudinary(files.bookCover[0]);
  //   bookPdfUrl = await uploadFileToCloudinary(files.bookPdf[0]);
  // } catch (error) {
  //   throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "File upload error");
  // }
  const bookCoverUrl = await fileUploader.uploadToDigitalOcean(files.bookCover[0]);
  const bookPdfUrl = await fileUploader.uploadToDigitalOcean(files.bookPdf[0]);
  
  const points= await Point.findOne({type:bookData.bookType})
  // Create book payload
  const payload = {
    ...bookData,
    points:points?.points||0,
    userId: user.userId,
    status: "pending",
    bookCover: bookCoverUrl?.Location,
    bookPdf: bookPdfUrl?.Location,

  };
  
  // Save book in the database
  let result;
  try {
    result = await Book.create(payload);
    if (!result) {
      throw new Error("Failed to insert book into DB");
    }
  } catch (error:any) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
  
  // Send notification if book creation is successful
  try {
    await Notification.create({
      user: user.userId,
      message: `Your book "${bookData.title}" has been submitted for approval`,
    });
  } catch (error:any) {
    console.error("Failed to create notification:", error.message);
  }
  
  return result;
  
}

// get all book with pagination and query by status

const getAllMyBooks = async (page: number, limit: number, status: string,user:JwtPayload) => {
    try {
      const query: any = {userId:user.userId};
      if (status) {
        query.status =  { $regex: new RegExp(`^${status}$`, 'i') };; // Ensure proper assignment to query
      }
  
      const books = await Book.find(query)
        .populate('userId') // Assuming 'userId' is the field in your schema
        .sort({ createdAt: -1 }) // Sort by newest first
        .skip((page - 1) * limit) // Pagination: skip documents for previous pages
        .limit(limit); // Limit the number of results per page
  
      if (!books) {
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to get books");
      }
  
      return books;
    } catch (error:any) {
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error.message || "An error occurred");
    }
  };
const getAllBooks = async (page: number, limit: number, user:JwtPayload,genre:string) => {
    try {
        const query: any = { userId: { $ne: user.userId },status:"live" ,isReadyForReview: true };
        if (genre) {
          query.genre = { $regex: new RegExp(`^${genre}$`, 'i') }; // Case-insensitive exact match
        }
        
  
      const books = await Book.find(query)
        .populate('userId') // Assuming 'userId' is the field in your schema
        .sort({ createdAt: -1 }) // Sort by newest first
        .skip((page - 1) * limit) // Pagination: skip documents for previous pages
        .limit(limit); // Limit the number of results per page
  
      if (!books) {
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to get books");
      }
  
      return books;
    } catch (error:any) {
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error.message || "An error occurred");
    }
  };


  //get for reviewed 
  const getReviewedBooks = async (id:string) => {
  const book=await Book.findById(id);
  if(!book) {
    throw new AppError(httpStatus.NOT_FOUND, "Book not found");
  }
  if(book.status!=="live"){
    throw new AppError(httpStatus.FORBIDDEN, "This book is not approved");
  }
    const result=await Book.findByIdAndUpdate(id, {isReadyForReview: true}, { new: true })
    if(!result) {
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to update book status");
    }
    return result;
  };
export const bookService = {
    insertBookIntoDB,
    getAllMyBooks,
    getAllBooks,
    getReviewedBooks
}