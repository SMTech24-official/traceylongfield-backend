import * as argon2 from "argon2";
import { IUser } from "../users/user.interface";
import { User } from "../users/user.model";
import { Book } from "../book/book.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { Notification } from "../activity/activity.model";
import { startSession } from "mongoose";

const createAdmin = async (payload: IUser) => {
  payload.password = await argon2.hash(payload.password);
  payload.role = "admin";
  payload.isVerified = true;
  const result = await User.create(payload);

  const { password, ...rest } = result.toObject();
  return rest;
};

const getAllPendingBook = async () => {
  const result = await Book.find({ status: "pending" });
  return result;
};
// get single pending book 

const getSingleBook = async (id: string) => {
  const result:any = await Book.findById(id).populate("userId","-password");
   if(!result){
    throw new AppError(httpStatus.NOT_FOUND,"book not found")
   }
    result.user = result.userId; // Rename userId to user
            // Delete the original userId field
 
  return result;
};

// approved Book

const approveBook = async (bookId: string) => {
  const session = await startSession();
  try {
    session.startTransaction();
  
    const existingBook = await Book.findById(bookId);
  
    if (!existingBook) {
      throw new AppError(httpStatus.NOT_FOUND, "Book not found");
    }
    if (existingBook.status === "live") {
      throw new AppError(httpStatus.FORBIDDEN, "This book is already live");
    }
  
    const book = await Book.findByIdAndUpdate(bookId, { status: "live" }, { new: true, session });
    if (!book) {
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to approve book");
    }
  
    if (book.status === "live") {
      await Notification.create([{
        user: book.userId,
        message: `Your book "${book.title}" has been approved`
      }], {session});
    }
  
    await session.commitTransaction();
    await session.endSession();
    return book;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to approve book");
  }
  
};

// rejected Book

const rejectBook = async (bookId: string, reason: string) => {
  const session = await startSession();
  try {
    session.startTransaction();
  
    const existingBook = await Book.findById(bookId);
  
    if (!existingBook) {
      throw new AppError(httpStatus.NOT_FOUND, "Book not found");
    }
    if (existingBook.status === "live") {
      throw new AppError(httpStatus.FORBIDDEN, "This book is already live");
    }
  
    const deleteBook=await Book.deleteOne(existingBook._id)
  
    if (deleteBook.deletedCount) {
      await Notification.create([{
        user: existingBook.userId,
        message: `Your book "${existingBook.title}" has been denied because ${reason}`
      }], {session});
    }
    await session.commitTransaction();
    await session.endSession();
    return deleteBook;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to approve book");
  }
};
export const adminServices = {
  getAllPendingBook,
  createAdmin,
  getSingleBook,
  approveBook,
  rejectBook
};
