
import { JwtPayload } from "jsonwebtoken";
import { ReadingBook } from "./reading.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { Book } from "../book/book.model";
import { User } from "../users/user.model";
import{ObjectId} from "mongodb"
import { Reading_status } from "../../utils/constant";

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
    readingStatus:Reading_status.reading,
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
    { readingStatus:Reading_status.paused},                      // Update action
    { new: true }                                     // Option to return the updated document
  );
  if (!readingBook) {
    throw new AppError(httpStatus.NOT_FOUND, "Reading book not found");
  }

  return readingBook;
};

// complete review
const completeReview = async (user: JwtPayload, readingBookId: string) => {
    
  const ExistUser = await User.findOne({ _id: user.userId });
  if (!ExistUser) {
    throw new AppError(httpStatus.FORBIDDEN, "User not found");
  }

  const readingBook = await ReadingBook.findByIdAndUpdate(
    { userId:user.userId,  _id:readingBookId },
    { readingStatus: Reading_status.finished },
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
    readingStatus: Reading_status.reading,
  }).populate({path:"bookId" }).populate({path:"userId",select:"-password" });;

  if (!readingBook) {
    throw new AppError(httpStatus.NOT_FOUND, "No reading book found");
  }

  return readingBook;
};

// get reading book that is status paused and user id match
const getToReviewOverDueBook = async (user: JwtPayload) => {
  const readingBook = await ReadingBook.find({
    userId: user.userId,
    readingStatus: Reading_status.paused,
  }).populate({path:"bookId" }).populate({path:"userId",select:"-password" });;

  if (!readingBook) {
    throw new AppError(httpStatus.NOT_FOUND, "No reading book found");
  }

  return readingBook;
};

// get reading book that is status finished and user id match
const getCompleteReview = async (user: JwtPayload) => {
    const readingBook = await ReadingBook.find({
      userId: user.userId,
      readingStatus: Reading_status.finished,
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




  const myBookReviewHistory=async(user:JwtPayload)=>{
   
   const result=await Book.find({userId:new ObjectId(user.userId)})
   const bookIds = result.map(book => book._id)
   const book=await ReadingBook.find()
   const reviewsCountWithBookDetails = await ReadingBook.aggregate([
    {
      $match: {
        bookId: { $in: bookIds }, // Match any bookId in the bookIds array
        isApproved: true // Only include approved reviews
      }
    },
    {
      $group: {
        _id: "$bookId", // Group by bookId
        reviewCount: { $sum: 1 } // Count the reviews for each bookId
      }
    },
    {
      $lookup: {
        from: "books", // The collection to join with (in this case, 'books')
        localField: "_id", // The field from the current collection (ReadingBook)
        foreignField: "_id", // The field from the 'books' collection
        as: "bookDetails" // Name of the new field where book details will be stored
      }
    },
    {
      $unwind: "$bookDetails" // Flatten the bookDetails array, since there will be only one match per bookId
    },
    {
      $project: {
        _id: 0, // Don't include _id in the final result
        bookTitle: "$bookDetails.title", // Include only the title of the book
        reviewCount: 1 // Include the review count
      }
    }
  ]);
    return reviewsCountWithBookDetails;
  }
export const readingService = {
  startReading,
  finishReading,
  getToReviewedBook,
  getToReviewOverDueBook,
  completeReview,
  getCompleteReview,
  getSingleReview,
  myBookReviewHistory
};
