import { Request } from "express"
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import config from "../../config";
import { Book } from "./book.model";
import { JwtPayload } from "jsonwebtoken";
import { Notification } from "../activity/activity.model";

const insertBookIntoDB=async(req:Request)=>{
    const user=req.user
     const files = req.files as any;
    if (!files|| !files.bookCover|| !files.bookPdf) {
        
        throw new AppError(
          httpStatus.BAD_REQUEST,
          "File is required for  add book"
        );
      }



      const bookCover = files.bookCover.map((file: any) => ({
        fileName: file?.filename,
        url: `${config.back_end_base_url}/uploads/${file?.originalname}`,
      }));
      const bookPdf = files.bookPdf.map((file: any) => ({
        fileName: file?.filename,
        url: `${config.back_end_base_url}/uploads/${file?.originalname}`,
      }));
      if (!req.body.data) {
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid request body");
      }
      let bookData;
      try {
        bookData = JSON.parse(req.body.data);
      } catch (error) {
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid JSON in request body");
      }

      const payload = {
        ...bookData,
        userId:user.userId,
        status:"pending",
        bookCover: bookCover[0].url,
        bookPdf: bookPdf[0].url,
      };

      const result=await Book.create(payload)
      if(!result) {
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to insert book into DB");
      }

      if(result){
        await Notification.create({user: user.userId, message:`your book ${bookData.title} has been submitted for approval`})
      }
      return result
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
        const query: any = { userId: { $ne: user.userId },status:"live" };
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

export const bookService = {
    insertBookIntoDB,
    getAllMyBooks,
    getAllBooks,
}