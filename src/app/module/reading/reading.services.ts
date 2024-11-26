
import { JwtPayload } from "jsonwebtoken";
import { ReadingBook } from "./reading.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { Book } from "../book/book.model";
import { User } from "../users/user.model";

const startReading = async (bookId: string, user: JwtPayload) => {
  const IsBook=await Book.findById(bookId);
  if (!IsBook) {
    throw new AppError(httpStatus.NOT_FOUND, "Book not found");
  }
  if(IsBook.status !=="live"){
    throw new AppError(httpStatus.FORBIDDEN, "This book is not live");
  }
  const existingReadingBook = await ReadingBook.findOne({
    bookId,
    userId: user.userId,
  });

  if (existingReadingBook) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are already reading this book"
    );
  }

  const book = await Book.findById(bookId);

  if (!book) {
    throw new AppError(httpStatus.NOT_FOUND, "Book not found");
  }
  // check user
  const ExistUser = await User.findOne({ _id: user.userId });
  if (!ExistUser) {
    throw new AppError(httpStatus.FORBIDDEN, "User not found");
  }
  const payload = {
    bookId,
    userId: user.userId,
    readingStatus: "reading",
  };
  const result = await ReadingBook.create(payload);
  return result;
};

// reading completed

const finishReading = async (readingBookId: string, user: JwtPayload) => {
  const ExistUser = await User.findOne({ _id: user.userId });
  if (!ExistUser) {
    throw new AppError(httpStatus.FORBIDDEN, "User not found");
  }
 
  const readingBook = await ReadingBook.findOneAndUpdate(
    {_id:readingBookId},  // Filter condition
    { readingStatus: "paused" },                      // Update action
    { new: true }                                     // Option to return the updated document
  );
  if (!readingBook) {
    throw new AppError(httpStatus.NOT_FOUND, "Reading book not found");
  }

  return readingBook;
};

// complete review
const completeReview = async (user: JwtPayload, readingBookId: string) => {
    console.log(user,readingBookId)
  const ExistUser = await User.findOne({ _id: user.userId });
  if (!ExistUser) {
    throw new AppError(httpStatus.FORBIDDEN, "User not found");
  }

  const readingBook = await ReadingBook.findByIdAndUpdate(
    { userId:user.userId,  _id:readingBookId },
    { readingStatus: "finished" },
    { new: true }
  );
  if (!readingBook) {
    throw new AppError(httpStatus.NOT_FOUND, "Reading book not found");
  }

  return readingBook;
};
// get reading book that is status reading and user id match

const getToReviewedBook = async (user: JwtPayload) => {
  const ExistUser = await User.findOne({ _id: user.userId });
  if (!ExistUser) {
    throw new AppError(httpStatus.FORBIDDEN, "User not found");
  }
  const readingBook = await ReadingBook.find({
    userId: user.userId,
    readingStatus: "reading",
  });

  if (!readingBook) {
    throw new AppError(httpStatus.NOT_FOUND, "No reading book found");
  }

  return readingBook;
};

// get reading book that is status paused and user id match
const getToReviewOverDueBook = async (user: JwtPayload) => {
  const readingBook = await ReadingBook.find({
    userId: user.userId,
    readingStatus: "paused",
  });

  if (!readingBook) {
    throw new AppError(httpStatus.NOT_FOUND, "No reading book found");
  }

  return readingBook;
};

// get reading book that is status finished and user id match
const getCompleteReview = async (user: JwtPayload) => {
    const readingBook = await ReadingBook.find({
      userId: user.userId,
      readingStatus: "finished",
    }).populate({path:"bookId" }).populate({path:"userId",select:"-password" });
  
    if (!readingBook) {
      throw new AppError(httpStatus.NOT_FOUND, "No reading book found");
    }
  
    return readingBook;
  };

  
  const getSingleReview = async (user: JwtPayload,reviewId:string) =>{
    const readingBook = await ReadingBook.findOne({
      _id:reviewId,
    }).populate({path:"bookId" }).populate({path:"userId",select:"-password" });
    return readingBook
  }

export const readingService = {
  startReading,
  finishReading,
  getToReviewedBook,
  getToReviewOverDueBook,
  completeReview,
  getCompleteReview,
  getSingleReview
};
