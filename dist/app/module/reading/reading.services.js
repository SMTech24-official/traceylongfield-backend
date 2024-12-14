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
exports.readingService = void 0;
const reading_model_1 = require("./reading.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const book_model_1 = require("../book/book.model");
const user_model_1 = require("../users/user.model");
const mongodb_1 = require("mongodb");
const constant_1 = require("../../utils/constant");
const startReading = (bookId, user) => __awaiter(void 0, void 0, void 0, function* () {
    const IsBook = yield book_model_1.Book.findById(bookId);
    if (!IsBook) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Book not found");
    }
    if (IsBook.status !== "live") {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "This book is not live");
    }
    const existingReadingBook = yield reading_model_1.ReadingBook.findOne({
        bookId,
        userId: user.userId,
    });
    if (existingReadingBook) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "You are already reading this book");
    }
    const book = yield book_model_1.Book.findById(bookId);
    if (!book) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Book not found");
    }
    // check user
    const ExistUser = yield user_model_1.User.findOne({ _id: user.userId });
    if (!ExistUser) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "User not found");
    }
    const payload = {
        bookId,
        userId: user.userId,
        readingStatus: constant_1.Reading_status.reading,
    };
    const result = yield reading_model_1.ReadingBook.create(payload);
    return result;
});
// reading completed
const finishReading = (readingBookId, user) => __awaiter(void 0, void 0, void 0, function* () {
    const ExistUser = yield user_model_1.User.findOne({ _id: user.userId });
    if (!ExistUser) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "User not found");
    }
    const readingBook = yield reading_model_1.ReadingBook.findOneAndUpdate({ _id: readingBookId }, // Filter condition
    { readingStatus: constant_1.Reading_status.paused }, // Update action
    { new: true } // Option to return the updated document
    );
    if (!readingBook) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Reading book not found");
    }
    return readingBook;
});
// complete review
const completeReview = (user, readingBookId) => __awaiter(void 0, void 0, void 0, function* () {
    const ExistUser = yield user_model_1.User.findOne({ _id: user.userId });
    if (!ExistUser) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "User not found");
    }
    const readingBook = yield reading_model_1.ReadingBook.findByIdAndUpdate({ userId: user.userId, _id: readingBookId }, { readingStatus: constant_1.Reading_status.finished }, { new: true });
    if (!readingBook) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Reading book not found");
    }
    return readingBook;
});
// get reading book that is status reading and user id match
const getToReviewedBook = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const ExistUser = yield user_model_1.User.findOne({ _id: user.userId });
    if (!ExistUser) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "User not found");
    }
    const readingBook = yield reading_model_1.ReadingBook.find({
        userId: user.userId,
        readingStatus: constant_1.Reading_status.reading,
    }).populate({ path: "bookId" }).populate({ path: "userId", select: "-password" });
    ;
    if (!readingBook) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "No reading book found");
    }
    return readingBook;
});
// get reading book that is status paused and user id match
const getToReviewOverDueBook = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const readingBook = yield reading_model_1.ReadingBook.find({
        userId: user.userId,
        readingStatus: constant_1.Reading_status.paused,
    }).populate({ path: "bookId" }).populate({ path: "userId", select: "-password" });
    ;
    if (!readingBook) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "No reading book found");
    }
    return readingBook;
});
// get reading book that is status finished and user id match
const getCompleteReview = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const readingBook = yield reading_model_1.ReadingBook.find({
        userId: user.userId,
        readingStatus: constant_1.Reading_status.finished,
    }).populate({ path: "bookId" }).populate({ path: "userId", select: "-password" });
    if (!readingBook) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "No reading book found");
    }
    return readingBook;
});
const getSingleReview = (user, reviewId) => __awaiter(void 0, void 0, void 0, function* () {
    const readingBook = yield reading_model_1.ReadingBook.findOne({
        _id: reviewId,
    }).populate({ path: "bookId" }).populate({ path: "userId", select: "-password" });
    return readingBook;
});
const myBookReviewHistory = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield book_model_1.Book.find({ userId: new mongodb_1.ObjectId(user.userId) });
    const bookIds = result.map(book => book._id);
    const book = yield reading_model_1.ReadingBook.find();
    const reviewsCountWithBookDetails = yield reading_model_1.ReadingBook.aggregate([
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
});
exports.readingService = {
    startReading,
    finishReading,
    getToReviewedBook,
    getToReviewOverDueBook,
    completeReview,
    getCompleteReview,
    getSingleReview,
    myBookReviewHistory
};
