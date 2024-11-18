import * as argon2 from "argon2";
import { IUser } from "../users/user.interface";
import { User } from "../users/user.model";
import { Book } from "../book/book.model";
import AppError from "../../errors/AppError";
import httpStatus, { REQUEST_ENTITY_TOO_LARGE } from "http-status";
import { Notification } from "../activity/activity.model";
import { startSession } from "mongoose";
import { ReadingBook } from "../reading/reading.model";
import { Point } from "../points/points.model";
import { IAddBook } from "../book/book.interface";
import { ObjectId } from 'mongoose';

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
  const result: any = await Book.findById(id).populate("userId", "-password");
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "book not found");
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

    const book = await Book.findByIdAndUpdate(
      bookId,
      { status: "live" },
      { new: true, session }
    );
    if (!book) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to approve book"
      );
    }

    if (book.status === "live") {
      await Notification.create(
        [
          {
            user: book.userId,
            message: `Your book "${book.title}" has been approved`,
          },
        ],
        { session }
      );
    }

    await session.commitTransaction();
    await session.endSession();
    return book;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to approve book"
    );
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

    const deleteBook = await Book.deleteOne(existingBook._id);

    if (deleteBook.deletedCount) {
      await Notification.create(
        [
          {
            user: existingBook.userId,
            message: `Your book "${existingBook.title}" has been denied because ${reason}`,
          },
        ],
        { session }
      );
    }
    await session.commitTransaction();
    await session.endSession();
    return deleteBook;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to approve book"
    );
  }
};

// get all review

const getAllReview = async () => {
  const result = await ReadingBook.find({
    readingStatus: "finished",
    isApproved: false,
  })
    .populate("userId", "-password")
    .populate("bookId");
  return result;
};
// get single review

const getSingleReview = async (id: string) => {
  console.log("getSingleReview");
  const result: any = await ReadingBook.findById(id)
    .populate("userId", "-password")
    .populate("bookId");
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "review not found");
  }

  return result;
};
// approved review
const approvedReview = async (id: string) => {
  const session = await startSession();
  try {
    session.startTransaction();
    const review = await ReadingBook.findById(id);

    if (!review) {
      throw new AppError(httpStatus.NOT_FOUND, "Review not found");
    }
    if (review.isApproved) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "This review is already approved"
      );
    }
    const reviewUser = await User.findById(review.userId);
    if (!reviewUser) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }
    const reviewBook = await Book.findById(review.bookId);
    if (!reviewBook) {
      throw new AppError(httpStatus.NOT_FOUND, "Book not found");
    }
    const reviewPoints = await Point.findOne({ type: reviewBook.bookType });
    if (!reviewPoints) {
      throw new AppError(httpStatus.NOT_FOUND, "Points not found");
    }
    const updateUserPoints = await User.findByIdAndUpdate(
      reviewUser._id,
      { points: reviewPoints.points },
      { new: true, session }
    );
    const updateReview = await ReadingBook.findByIdAndUpdate(
      id,
      { isApproved: true },
      { new: true, session }
    );
    await session.commitTransaction();
    await session.endSession();
    return updateReview;
  } catch (error: any) {
    if (error) {
      throw new AppError(httpStatus.FORBIDDEN, error.message);
    }
    await session.abortTransaction();
    await session.endSession();
  }
};
// reject review

const rejectReview = async (id: string, reason: string) => {
  console.log(id,reason)
  const session = await startSession();
try {
  session.startTransaction();
  const review=await ReadingBook.findById(id)
  if (!review) {
    throw new AppError(httpStatus.NOT_FOUND, "Review not found");
  }
  if (review.isApproved) {
    throw new AppError(httpStatus.FORBIDDEN, "This review is already approved");
  }
  const deleteReview = await ReadingBook.deleteOne({ _id: review.id }, { session });

  if (deleteReview.deletedCount) {
    await Notification.create(
      [
        {
          user: review.userId,
          message: `Your review  has been denied because ${reason}`,
        },
      ],
      { session }
    );
  }
  await  session.commitTransaction()
  await session.endSession();
  return deleteReview
} catch (error:any) {
  await session.abortTransaction();
  await session.endSession();
  throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
}


}

// get all users
const getAllUsers = async () => {
  const users = await User.find().select('-password -otp -otpExpires');
  return users;
};
// get single user

const getSingleUser = async (id: string) => {
  const user = await User.findById(id).select("-password -otp -otpExpires");
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  return user;
};
// get all book based users with query parameters
const getAllBookBasedUsers = async (query: any,id:string) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;
console.log(
  id
)
const baseQuery: Partial<IAddBook> = {

};

if(query.status){
  baseQuery.status=query.status
}
console.log(baseQuery)
  const result = await Book.find({userId:id,...baseQuery})
   .skip(skip)
   .limit(limit)
   //.populate("userId", "-password")
   

  return result;
};
// get single book

// const getSingleBook = async (id: string) => {
//   const book = await Book.findById(id);
//   if (!book) {
//     throw new AppError(httpStatus.NOT_FOUND, "Book not found");
//   }
//   return book;
// };
export const adminServices = {
  getAllPendingBook,
  createAdmin,
  getSingleBook,
  approveBook,
  rejectBook,
  getAllReview,
  getSingleReview,
  approvedReview,
  rejectReview,
  getAllUsers,
  getSingleUser,
  getAllBookBasedUsers
};
