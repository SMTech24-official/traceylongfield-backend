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
        readingStatus: "reading",
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
    { readingStatus: "paused" }, // Update action
    { new: true } // Option to return the updated document
    );
    if (!readingBook) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Reading book not found");
    }
    return readingBook;
});
// complete review
const completeReview = (user, readingBookId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(user, readingBookId);
    const ExistUser = yield user_model_1.User.findOne({ _id: user.userId });
    if (!ExistUser) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "User not found");
    }
    const readingBook = yield reading_model_1.ReadingBook.findByIdAndUpdate({ userId: user.userId, _id: readingBookId }, { readingStatus: "finished" }, { new: true });
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
        readingStatus: "reading",
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
        readingStatus: "paused",
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
        readingStatus: "finished",
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
exports.readingService = {
    startReading,
    finishReading,
    getToReviewedBook,
    getToReviewOverDueBook,
    completeReview,
    getCompleteReview,
    getSingleReview
};
